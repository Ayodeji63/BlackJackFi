/* eslint-disable no-console */
import { toast } from "react-toastify";
import { makeObservable } from "mobx";
import equal from "fast-deep-equal";
import { observable } from "mobx";
import { computed } from "mobx";
import { action } from "mobx";

import { toastSettings } from "../components/App/App.styled";
import { EndGameActions } from "../types.ds";
import { socket } from "../server/socket";
import { ActionType } from "../types.ds";
import { ModalTypes } from "../types.ds";
import { SocketEmit } from '../types.ds';
import { SoundType } from '../types.ds';
import { IMessage } from '../types.ds';
import { SocketOn } from '../types.ds';
import { IPlayer } from '../types.ds';
import { IModal } from '../types.ds';
import { ITable } from '../types.ds';
import { IChat } from '../types.ds';
import { Dealer } from './dealer';
import { Player } from './player';
import { Music } from './music';
import { Table } from './table';
import { Card } from './card';
import { Chat } from './chat';
import { resolve } from "path";

/* eslint-disable @typescript-eslint/no-floating-promises */

export class Game {
    @observable public player: Player | null = null;
    @observable public table: Table | null = null;
    @observable public chat: Chat | null = null;
    @observable public music: Music | null = null;
    @observable public allActionsMade = false;
    @observable public modal: IModal = {
        type: ModalTypes.CreateOrJoin,
        hide: false,
    };

    public emit = {
        [SocketEmit.ChatSendMessage]: (message: string): void => {
            if (this.table) {
                socket.emit(SocketEmit.ChatSendMessage, this.table?.id ?? '', message);
            }
        },
        [SocketEmit.TopupBalance]: (balance: number): void => {
            if (this.table && this.player) {
                socket.emit(
                    SocketEmit.TopupBalance,
                    balance,
                    this.table.id,
                    this.player.id
                );
            }
        },
        [SocketEmit.JoinTable]: (
            tableId: string,
            name: string,
            balance: number
        ): void => {
            socket.emit(SocketEmit.JoinTable, tableId, name, balance);
        },
        [SocketEmit.CreateTable]: (name: string, balance: number): void => {
            socket.emit(SocketEmit.CreateTable, name, balance);
        },
        [SocketEmit.EndGame]: (endGameAction: EndGameActions): void => {
            socket.emit(
                SocketEmit.EndGame,
                this.table?.id,
                this.player?.id,
                endGameAction
            );
        },
        [SocketEmit.Deal]: (): void => {
            socket.emit(SocketEmit.Deal, this.table?.id);
        },
        [SocketEmit.Action]: (actionType: ActionType): void => {
            socket.emit(
                SocketEmit.Action,
                actionType,
                this.table?.id,
                this.table?.currentPlayer?.id 
            );
        },
        [SocketEmit.SetBet]: (spotId: string): void => {
            socket.emit(
                SocketEmit.SetBet,
                this.table?.id,
                spotId,
                this.player?.id,
                this.table?.currentBetBtnValue ?? 0
            );
        },
        [SocketEmit.RemoveBet]: (playerId: string, betIndex: number): void => {
            socket.emit(SocketEmit.RemoveBet, this.table?.id, playerId, betIndex);
        },
    };

    private dealerActionHip: {
        table: string;
        action: ActionType | undefined;
    }[] = [];

    public constructor() {
        makeObservable(this);

        socket.on(SocketOn.Error, (message) => toast.error(message, toastSettings));

        socket.on(SocketOn.Message, (message, type) => {
            if (type) {
                if (!(this.modal.type === ModalTypes.Chat && !this.modal.hide)) {
                    toast(message, toastSettings);
                }
                this.playSound(SoundType.Message);
            } else if (!type) {
                toast(message, toastSettings);
            }
        });
        socket.on(SocketOn.ChatServerMessage, (messageStr: string) => {
            const message = JSON.parse(messageStr) as IMessage;
            this.chat?.addMessage(message);
        });

        socket.on(SocketOn.TableJoined, (table) => {
            this.onTableJoined(JSON.parse(table));
            this.modalUpdate(true);
            this.playSound(SoundType.PlayerConnected);
          });

          socket.on(SocketOn.DisconnectPlayer, (tableStr) => {
            this.handleTableUpdate(tableStr);
            this.playSound(SoundType.PlayerDisconnected);
          });

          socket.on(SocketOn.BetUpdate, (playersStr) => {
            this.updateAllPlayersArray(JSON.parse(playersStr));
            this.playSound(SoundType.Chip);
          });
          socket.on(SocketOn.BalanceToppedUp, (playersStr) => {
            const playerObj = JSON.parse(playersStr) as IPlayer;
            const player = this.findPlayerById(this.player.id);
            if (player) {
                player.update(playerObj);
                this.playSound(SoundType.Balance);
            }
          });

          socket.on(SocketOn.Dealt, (tableStr) => {
            this.allActionsMade = false;
            this.handleTableUpdate(tableStr);
            this.playSound(SoundType.Flip);

            this.handleAdditionalStand();
          });

          socket.on(SocketOn.ActionMade, (tableStr, actionType) => {
            this.handleTableUpdate(tableStr);
            //music
            switch (actionType) {
                case ActionType.Hit:
                case ActionType.Split:
                    this.playSound(SoundType.Flip);
                    break;
                case ActionType.Insurance:
                    this.playSound(SoundType.Chip);
                    break;
                case ActionType.Double:
                    this.playSound(SoundType.Chip);
                    this.playSound(SoundType.Flip);
                    break;
            }

            this.handleAdditionalStand();
          });

          socket.on(SocketOn.DealerMadeAction, (tableStr, actionType) => {
            this.dealerActionsHip.push({this.table: tableStr, action: actionType});
          });

          socket.on(SocketOn.WinnersCounted, (tableStr) => {
            this.dealerActionHip.push({table: tableStr, action: undefined});

            this.handleDeallerActionsAndWinnerCounting();
          });

          socket.on(SocketOn.GameEnded, (tableStr) => {
            this.handleTableUpdate(tableStr);
            if (this.table?.dealer && 
                !this.table?.roundIsStarted && 
                this.player?.handIsEmpty
                ) {
                this.table.dealer null;
            }
            if (this.player?.handIsEmpty) {
                this.modalUpdate(true);
            }
          });
    }

    @computed public get gameIsReady(): boolean {
        return !!(this.player && this.table);
    }

    @action.bound public onTableCreated(
        table: ITable,
        player: IPlayer,
        chat: IChat
    ): void {
        this.table = new Table(table.id);
        this.chat = new Chat();
        this.music = new Music();
        this.updateTableInfo(table);
        this.player = this.findPlayerById(player.id) ?? null;

        chat.messages.forEach((message) => {
            this.chat?.addMessage(message);
        });
    };

    @action.bound public onTableJoined(table: ITable): void {
        this.updateAllPlayersArray(table.allPlayers);
    }

    @action.bound public modalUpdate(
        hide: boolean,
        type = this.modal.type
    ): void {
        this.modal.type = type;
        this.modal.hide = hide;
    }

    public findPlayerById(playerId: string): Player | undefined {
        const table = this.table;
        return table
          ? table.allPlayers.find((player) => player.id === playerId)
          : undefined;
      }

    public playSound(soundType: SoundType): void {
        const audio = this.music?.sounds[soundType] ?? this.music?.notifications[soundType];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
             // eslint-disable-next-line @typescript-eslint/no-floating-promises
        audio.play();
        }
    }

    public getNameBySpotId(id: string): string {
        const spot = this.table?.spots[id];
        if (spot) {
            const spotParent = spot ? spot[0].parentPlayer : undefined;
            const name = spotParent ? spotParent.name : '';
            return name
        } else {
            return '';
        }
    }

    private handleAdditionalStand() {
        if (this.player?.id === this.table?.currentPlayer?.id || this.player?.id === this.table?.currentPlayer?.parentPlayer?.id || this.player?.id === this.table?.currentPlayer?.parentAfterSplitPlayer?.id) {
            if (this.table?.currentPlayer?.isBJ || this.table?.currentPlayer?.isBust || this.table?.currentPlayer?.isNaturalBJ) {
                (async () => {
                    try {
                        await new Promise((resolve) => setTimeout(resolve, 600));
                        this.emit[SocketEmit.Action](ActionType.Stand)
                    } catch (error) {
                        
                    }
                })
            }
        }
    }
}   
