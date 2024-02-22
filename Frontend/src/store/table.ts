/* eslint-disable @typescript-eslint/lines-between-class-members */
import { makeObservable } from 'mobx';
import { observable } from 'mobx';
import { computed } from 'mobx';
import { action } from 'mobx';

import { GameStatus } from '../types.ds';
import { PlayerType } from '../types.ds';
import { IPlayer } from '../types.ds';
import { Rank } from '../types.ds';
import { TBet } from '../types.ds';
import { Dealer } from './dealer';
import { Player } from './player';
import { Card } from './card';
import { game } from './game';


export class Table {
    @observable public allPlayers: Player[] = [];
    @observable public currentBetBtnValue: TBet = 2;
    @observable private _dealer: Dealer | null = null;
    @observable private _currentPlayerIndex: number | null = null;
    @observable private _roundIsStarted = false;

    public constructor(public readonly id: string) {
        this.id = id;
        makeObservable(this);
    }

    @computed public get players(): Player[] {
        return this.allPlayers.filter(
          (player) => player.playerType !== PlayerType.Parent
        );
      }
    
      @computed public get playingPlayers(): Player[] {
        return this.allPlayers.filter((player) => !!player.hand.length);
      }
    
      @computed public get parentPlayers(): Player[] {
        return this.allPlayers.filter(
          (player) => player.playerType === PlayerType.Parent
        );
      }

      @computed public get currentPlayer(): Player | null {
        return typeof this._currentPlayerIndex === 'number'
          ? this.players[this._currentPlayerIndex]
          : null;
      }
    
      @computed public get spots(): Record<string, Player[]> {
        return this.players.reduce<Record<string, Player[]>>((result, player) => {
          if (!result[player.spotId]) {
            result[player.spotId] = [];
          }
          result[player.spotId].push(player);
          return result;
        }, {});
      }

      @computed public get gameStatus(): GameStatus {
        if (
          this.parentPlayers.some(
            (parentPlayer) =>
              !this.players.find(
                (player) => player.parentPlayer?.id === parentPlayer.id
              )
          ) &&
          this.parentPlayers.every(
            (player) => player.balance >= 2 || player.betChipsTotalWithChildren
          ) &&
          Object.keys(this.spots).length < 5 &&
          !this._dealer
        ) {
          return GameStatus.WaitBets;
        }
        if (this._dealer?.hand.length) {
          return GameStatus.Playing;
        }
        if (!!this.playingPlayers.length) {
          return GameStatus.WaitEndAndBets;
        }
        return GameStatus.ReadyToStart;
      }
}