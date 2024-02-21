import { makeObservable } from 'mobx';
import { observable } from 'mobx';
import { computed } from 'mobx';
import { override } from 'mobx';
import { action } from 'mobx';

import { PlayerGameState } from '../types.ds';
import { PlayerType } from '../types.ds';
import { IPlayer } from '../types.ds';
import { TBet } from '../types.ds';
import { Dealer } from './dealer';
import { Card } from './card';
import { game } from './game';

export class Player extends Dealer {
    @observable public betChips: TBet[];
    @observable public insuranceBet: number | null;
    @observable public parentAfterSplitPlayer: Player | null;
    @observable public parentPlayer: Player | null;
    @observable private _balance: number;
    @observable private _name: string;

    public constructor(
        _name: string,
        spotId: string,
        hand: Card[],
        roundIsEnded: boolean,
        betChips: TBet[],
        insuranceBet: number | null,
        parentAfterSplitPlayer: Player | null,
        parentPlayer: Player | null,
        _balance: number,
        id: string
      ) {
        super(spotId, hand, roundIsEnded, id);
        this._name = _name;
        this.betChips = betChips;
        this.insuranceBet = insuranceBet;
        this.parentAfterSplitPlayer = parentAfterSplitPlayer;
        this.parentPlayer = parentPlayer;
        this._balance = _balance;
        makeObservable(this);
      }

      @computed public get betChipsTotal(): number {
        return this.betChips.length
          ? (this.betChips as number[]).reduce((bet1, bet2) => bet1 + bet2)
          : 0;
      }


  @computed public get betChipsTotalWithChildren(): number {
    if (game.table) {
      const players = game.table.allPlayers.filter(
        (player) =>
          player.id === this.id ||
          player.parentAfterSplitPlayer?.id === this.id ||
          player.parentPlayer?.id === this.id
      );
      const chips = players
        .map((player) => player.betChips)
        .reduce((a, b) => a.concat(b));
      return chips.length
        ? (chips as number[]).reduce((bet1, bet2) => bet1 + bet2)
        : 0;
    }
    return 0;
  }

  @computed public get balance(): number {
    return this.playerType !== PlayerType.Parent && this.parentPlayer
      ? this.parentPlayer._balance
      : this._balance;
  }
}
