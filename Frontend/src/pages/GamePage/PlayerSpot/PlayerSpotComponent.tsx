import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';

import {
  PlayersWrapper,
  SpotStyled,
  OnePlayerWrapper,
  SpotWrapper,
  Name,
} from './Spot.styled';
import { PlayerGameState, SocketEmit, SoundType } from '../../../types.ds';
import { PlayerComponent } from './PlayerComponent';
import { game } from '../../../store/game';
import { Player } from '../../../store/player';
import { useAuth } from '../../../utils/common/AuthProvider';
import { LocalAccountSigner } from '@alchemy/aa-core';
import { createLightAccountAlchemyClient } from '@alchemy/aa-alchemy';
import { encodeFunctionData, parseEther } from 'viem';
import casinoFiBetAbi from "../../../CasinoFiBet.json"
import { polygonMumbai,baseSepolia, arbitrumSepolia, type Hex, UserOperationOverrides, SendUserOperationResult } from "@alchemy/aa-core";
import casinoFiAbi from "../../../CasinoFiToken.json";
import { createWalletClient, http } from "viem";
import { walletClient, account, publicClient } from "../../../utils/client";

type PlayerProps = {
  id: string;
};

export const PlayerSpotComponent: React.FC<PlayerProps> = observer(({ id }) => {
  const gameTable = game.table ?? null;
  const {user} = useAuth();

  const spotClass = useMemo(() => {
    const className = [];
    if (gameTable?.currentPlayer && gameTable.currentPlayer.spotId === id) {
      className.push('active');
    }

    if (!gameTable?.spots[id] && !gameTable?.dealer) {
      className.push('empty');
    }

    if (gameTable?.roundIsStarted) {
      className.push('disabled');
    }

    return className.join(' ');
  }, [
    gameTable?.currentPlayer,
    gameTable?.dealer,
    gameTable?.roundIsStarted,
    gameTable?.spots,
    id,
  ]);

  const playerClass = (player: Player) => {
    const className = [];
    if (
      (player.state === PlayerGameState.Blackjack ||
        player.state === PlayerGameState.NaturalBlackjack ||
        player.state === PlayerGameState.Win) &&
      player.state
    ) {
      className.push('win');

    }
    if (
      (player.state === PlayerGameState.Loose ||
        player.state === PlayerGameState.Bust) &&
      player.state
    ) {
      className.push('loose');

    }
    return className.join(' ');
  };

  const AA_APIKEY = String(process.env.REACT_APP_BASE_SEPOLIA_API_KEY);
  const chain = baseSepolia;

 
  
  const setBet = async (tableId: unknown, betChip: unknown) => {
    try {
      console.log('Private key', user?.privateKey);
      console.log('Api key', AA_APIKEY);
      const privateKey = user?.privateKey ?? ''; 
      const signer = LocalAccountSigner.privateKeyToAccountSigner(`0x${privateKey}`);
      
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
      

    
      console.log("Provider is", provider.getAddress());
      const betContractAddress = process.env.REACT_APP_CASINOFI_BET_ADDRESS as `0x${string}`;
      const tokenAddress = process.env.REACT_APP_CASINOFI_TOKEN_ADDRESS_ARB as `0x${string}`;

      const data1 = encodeFunctionData({
        abi: casinoFiBetAbi,
        functionName: "setBet",
        args: [String(tableId), parseEther(String(betChip))]
      });

      const data2 = encodeFunctionData({
        abi: casinoFiAbi,
        functionName: "approve",
        args: [betContractAddress, parseEther(String(betChip))]
      })

      // const contractAddress = process.env.REACT_APP_CASINOFI_TOKEN_ADDRESS_ARB as `0x${string}`;
      const amountToSend: bigint = parseEther("0")

      const { hash: uoHash } = await provider.sendUserOperation({
        uo: [
          {
            target: tokenAddress,
            data: data2,
            value: amountToSend
          },
          {
            target: betContractAddress, // The desired target contract address
            data: data1, // The desired call data
            value: amountToSend, // (Optional) value to send the target contract address
          }
         
        ]
      });
      
      console.log(uoHash); // Log the transaction hash

    } catch (e) {
      console.log(e);
    }
  }
  const handleSetNewBet = async () => {
    if (
      gameTable &&
      game.player?.canBetAtThisSpot(id) &&
      !gameTable?.roundIsStarted
    ) {
      
      await setBet(game.table?.id, gameTable.currentBetBtnValue);

      game.emit[SocketEmit.SetBet](id);
      console.log("Button value here is", gameTable.currentBetBtnValue);
      console.log("Table id here is ", game.table?.id);
    }
  };

  return (
    <SpotWrapper className="spot">
      <Name>{game.getNameBySpotId(id)}</Name>
      <SpotStyled
        onClick={handleSetNewBet}
        className={spotClass}
        soundType={SoundType.Chip}
      >
        <PlayersWrapper>
          {gameTable?.spots[id] &&
            gameTable.spots[id].map((player) => (
              <OnePlayerWrapper
                key={`${player.id}-player`}
                className={playerClass(player)}
              >
                <PlayerComponent player={player} spotId={id} />
              </OnePlayerWrapper>
            ))}
        </PlayersWrapper>
      </SpotStyled>
    </SpotWrapper>
  );
});
