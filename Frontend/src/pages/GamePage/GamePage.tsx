import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { HandySvg } from 'handy-svg';

import {
  BalanceStyled,
  OptionsPanel,
  GameWrapper,
  Wrapper,
} from './GamePage.styled';
import { StyledBtn, toastSettings } from '../../components/App/App.styled';
import { GameActionsComponent } from './GameActions/GameActionsComponent';
import { DealerSpotComponent } from './PlayerSpot/DealerSpotComponent';
import { PlayerSpotComponent } from './PlayerSpot/PlayerSpotComponent';
import { ModalTypes, SocketEmit, SoundType } from '../../types.ds';
import { SvgBtnWithSound } from '../../sounds/StyledBtnWithSound';
import soundSettingsIcon from '../../assets/settings.svg';
import { SpotsZone } from './PlayerSpot/Spot.styled';
import moneyIcon from '../../assets/money.svg';
import { BetPanel } from './BetPanel/BetPanel';
import { GameText } from './GameText/GameText';
import chatIcon from '../../assets/chat.svg';
import copyIcon from '../../assets/copy.svg';
import { game } from '../../store/game';
import { Deck } from './Deck/Deck';
import casinoFiAbi from "../../CasinoFiBet.json"
import { createWalletClient, encodeFunctionData, http, parseEther } from "viem";
import casinoFiBetAbi from "../../CasinoFiBet.json";
import { walletClient, account, publicClient } from "../../utils/client";
import { Player } from '../../store/player';
import { useAuth } from '../../utils/common/AuthProvider';
import { Hex, LocalAccountSigner, baseSepolia } from '@alchemy/aa-core';
import { createLightAccountAlchemyClient } from '@alchemy/aa-alchemy';



export const GamePage: React.FC = observer(() => {
  const navigate = useNavigate();
  const {user} = useAuth();


  useEffect(() => {
    if (!(game.table && game.player)) {
      navigate('/');
      game.modalUpdate(false, ModalTypes.CreateOrJoin);
    }
  }, [navigate]);

 async function getTransactionCount() {
    const transactionCount = await publicClient.getTransactionCount({  
      address: account.address,
    })
    return transactionCount;
  }

  const handleWinOrLoose = async () => {
    try {
      const AA_APIKEY = String(process.env.REACT_APP_BASE_SEPOLIA_API_KEY);
  const chain = baseSepolia;
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

      const provider = await createLightAccountAlchemyClient(providerConfig);
      const status = game.player?.isWin ? 0 : 1;
      const tableId = game.table?.id || '';
      const data1 = encodeFunctionData({
        abi: casinoFiBetAbi,
        functionName: "handleWinAndLoose",
        args: [status, tableId, user?.scwAddress]
      });

      const amountToSend: bigint = parseEther("0");
      const betContractAddress = process.env.REACT_APP_CASINOFI_BET_ADDRESS as `0x${string}`;

      const { hash: uoHash } = await provider.sendUserOperation({
        uo: {
          target: betContractAddress,
          data: data1
        }
      });
      console.log(uoHash);
    } catch (e) {
      console.log(e);
    }
  }
    useEffect(() => {
      if (game.player?.roundIsEnded) {
        handleWinOrLoose()
        game.modalUpdate(false, ModalTypes.GameEnd); 
      } 
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [game.player?.roundIsEnded]);
    

  const handlePlayBtn = () => {
    game.emit[SocketEmit.Deal]();
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(game.table?.id ?? '')
      .then(() => {
        toast('Table id successfully copied!', toastSettings);
      })
      .catch(() => {
        toast.error('Failed to copy!', toastSettings);
      });
  };
  const handleModalOpen = (type: ModalTypes) => () => {
    game.modalUpdate(false, type);
  };

  const spotsZone = (
    <SpotsZone>
      {Array.from({ length: 5 }).map((_, index) => (
        <PlayerSpotComponent key={index} id={`spot-${index}`} />
      ))}
    </SpotsZone>
  );

  const playButtonOrGameStatus =
    game.table?.ableToStartGame && game.player?.betChipsTotalWithChildren ? (
      <StyledBtn onClick={handlePlayBtn}>PLAY</StyledBtn>
    ) : game.table?.ableToStartGame ? (
      game.player?.balance && game.player?.balance > 2 ? (
        <div>No empty spots left</div>
      ) : (
        <div>Insufficient funds! </div>
      )
    ) : (
      <div>{game.table?.gameStatus}</div>
    );

  const gameActionsComponent = game.table?.roundIsStarted && (
    <GameActionsComponent />
  );

  const copyTableIdBtn = (
    <SvgBtnWithSound soundType={SoundType.Click} onClick={handleCopyClick}>
      <HandySvg
        src={copyIcon}
        width={0.017 * Math.min(window.innerWidth, window.innerHeight)}
        height={0.017 * Math.min(window.innerWidth, window.innerHeight)}
      />
    </SvgBtnWithSound>
  );

  const topUpBalanceBtn = (
    <SvgBtnWithSound
      soundType={SoundType.Click}
      onClick={handleModalOpen(ModalTypes.Balance)}
      disabled={
        game.table?.roundIsStarted &&
        !!game.table.playingPlayers.find(
          (player) => game.player?.id === player.parentPlayer?.id)
      }
    >
      <HandySvg
        src={moneyIcon}
        width={0.017 * Math.min(window.innerWidth, window.innerHeight)}
        height={0.017 * Math.min(window.innerWidth, window.innerHeight)}
      />
    </SvgBtnWithSound>
  );
  const chatBtn = (
    <SvgBtnWithSound
      soundType={SoundType.Click}
      onClick={handleModalOpen(ModalTypes.Chat)}
    >
      <HandySvg
        src={chatIcon}
        width={0.017 * Math.min(window.innerWidth, window.innerHeight)}
        height={0.017 * Math.min(window.innerWidth, window.innerHeight)}
      />
    </SvgBtnWithSound>
  );
  const soundsSettingsBtn = (
    <SvgBtnWithSound
      soundType={SoundType.Click}
      onClick={handleModalOpen(ModalTypes.Sounds)}
    >
      <HandySvg
        src={soundSettingsIcon}
        width={0.017 * Math.min(window.innerWidth, window.innerHeight)}
        height={0.017 * Math.min(window.innerWidth, window.innerHeight)}
      />
    </SvgBtnWithSound>
  );

  return (
    <Wrapper>
      <OptionsPanel>
        {copyTableIdBtn} {chatBtn} {soundsSettingsBtn}
      </OptionsPanel>
      <BalanceStyled>
        <div>{game.player?.balance}</div>
        {/* {topUpBalanceBtn} */}
      </BalanceStyled>

      <GameWrapper>
        <DealerSpotComponent />
        <GameText />

        {spotsZone}
        <Deck />
      </GameWrapper>

      <div className="buttons">
        <BetPanel />

        {playButtonOrGameStatus}
        {gameActionsComponent}
      </div>
    </Wrapper>
  );
});
