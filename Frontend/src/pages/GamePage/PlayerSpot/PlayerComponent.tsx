import React, { useCallback, MouseEvent, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import {
  PlayerComponentWrapper,
  CardsWrapper,
  ChipsWrapper,
  CardsTotal,
} from './Spot.styled';
import { getBetColor } from '../../../utils/getBetColor';
import { CardComponent } from '../Card/CardComponent';
import { Color } from '../../../constants/constants';
import { Player } from '../../../store/player';
import { SocketEmit } from '../../../types.ds';
import { game } from '../../../store/game';
import { Bet } from '../BetPanel/Bet';
import { useAuth } from '../../../utils/common/AuthProvider';
import { LocalAccountSigner } from '@alchemy/aa-core';
import { createLightAccountAlchemyClient } from '@alchemy/aa-alchemy';
import { encodeFunctionData, parseEther } from 'viem';
import casinoFiBetAbi from "../../../CasinoFiBet.json"
import { polygonMumbai, baseSepolia, arbitrumSepolia, type Hex, UserOperationOverrides, SendUserOperationResult } from "@alchemy/aa-core";
import casinoFiAbi from "../../../CasinoFiToken.json";

type PlayerComponentProps = {
  player: Player;
  spotId: string;
};
export const PlayerComponent: React.FC<PlayerComponentProps> = observer(
  ({ player, spotId }) => {

    const {user} = useAuth();

    const removeBet = async (tableId: string, betChip: number) =>{
      try {
        const AA_APIKEY = String(process.env.REACT_APP_BASE_SEPOLIA_API_KEY);
        const chain = baseSepolia;
      const privateKey = user?.privateKey ?? ''; 
        const signer = LocalAccountSigner.privateKeyToAccountSigner(`0x${privateKey}`);
      const betContractAddress = process.env.REACT_APP_CASINOFI_BET_ADDRESS as `0x${string}`;

        const providerConfig = {
          apiKey: AA_APIKEY,
          chain,
          signer,
          gasManagerConfig: {
            policyId: String(process.env.REACT_APP_BASE_SEPOLIA_POLICY_ID)
          }
        };
        
        console.log(providerConfig); // Debug: Log the configuration object
        
        const provider = await createLightAccountAlchemyClient(providerConfig);

        const data1 = encodeFunctionData({
          abi: casinoFiBetAbi,
          functionName: "removeBet",
          args: [tableId, parseEther(String(betChip))]
        });

        const amountToSend: bigint = parseEther("0");

        const {hash: uoHash} = await provider.sendUserOperation({
          uo: {
            target: betContractAddress,
            data: data1,
            value: amountToSend
          }
        });

      console.log(uoHash); // Log the transaction hash

      } catch (e) {
        console.log(e)
      }
    }
    const handleRemoveBet = useCallback(
      (index: number, bet: number) => async (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (
          !game.table?.roundIsStarted &&
          game.player?.canBetAtThisSpot(spotId)
        ) {
          const TableId = game?.table?.id ? game?.table?.id : '';
         await removeBet(TableId, bet);
          game.emit[SocketEmit.RemoveBet](player.id, index);
        }
      },
      [player.id, spotId]
    );

    const cardRef = useRef<HTMLDivElement>(null);
    const activeClassName =
      player.id === game.table?.currentPlayer?.id ? 'active' : '';

    return (
      <PlayerComponentWrapper className={activeClassName}>
        <ChipsWrapper>
          {
            /**InsuranceBet */
            !!player.insuranceBet && (
              <Bet
                value={player.insuranceBet}
                color={Color.MainAccent}
                size={5.5}
                active={false}
              />
            )
          }
          {
            /**Bet */
            player.betChips.map((bet, index) => (
              <Bet
                key={`${player}-bet${index}-${bet}`}
                value={bet}
                onBetSet={handleRemoveBet(index, bet)}
                color={getBetColor(bet)}
                size={5.5}
                active={false}
              />
            ))
          }
        </ChipsWrapper>
        <CardsWrapper ref={cardRef} id={`${spotId}Cardholder`}>
          {player?.hand.map((card) => (
            <CardComponent
              cardholderId={`${spotId}Cardholder`}
              key={`${card.id}-Card`}
              suit={card.suit}
              rank={card.rank}
              id={card.id}
              isNew={card.isNew}
            />
          ))}
          {player.handTotal > 0 && (
            <CardsTotal
              className={
                player.isBust
                  ? 'bust'
                  : player.isBJ || player.isNaturalBJ
                    ? 'bj'
                    : ''
              }
            >
              {player.handTotal}
            </CardsTotal>
          )}
        </CardsWrapper>
      </PlayerComponentWrapper>
    );
  }
);
