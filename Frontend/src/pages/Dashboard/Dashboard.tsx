import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../utils/common/AuthProvider';
import { StyledBtn } from '../../components/App/App.styled';
import userbase from 'userbase-js';
import { useNavigate } from 'react-router-dom';
import { ModalTypes, SocketEmit, SocketOn } from '../../types.ds';
import { game } from '../../store/game';
import { publicClient } from "../../utils/client";
import casinoFiTokenAbi from "../../CasinoFiToken.json"
import { formatEther } from 'viem';
import { socket } from '../../server/socket';
import { ChecboxInput, CheckboxInputWrapper, CheckboxLabel, ErrorMsg, Input, InputWrapper, Label, Form } from '../../components/ModalsManager/ModalsManager.styled';
import { useForm } from 'react-hook-form';

interface FormValues {
  joinExistingTable: boolean;
  tableId: string;
}
export const Dashboard: React.FC = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [userBalance, setUserBalance] = useState<number>(0);
  const {register, handleSubmit, formState: {errors}, watch, setError} = useForm<FormValues>();
    const getBalance = async () => {
      if (user?.scwAddress) {
        const data = await publicClient.readContract({
          address: process.env.REACT_APP_CASINOFI_TOKEN_ADDRESS_ARB as `0x${string}`,
          abi: casinoFiTokenAbi,
          functionName: "balanceOf",
          args: [user?.scwAddress]
        }) as any
        setUserBalance(Number(formatEther(data)));
        return Number(formatEther(data));
      }
    }
    useEffect(() => {
    getBalance();
    }, [user])
    const createTable = useCallback(
      async () => {
        try {
          const thisName = user?.username ? user.username : '';
          const balance = await getBalance(); // Wait for the balance to be available
          console.log("User Balance is ", balance);
    
          game.emit[SocketEmit.CreateTable](thisName, balance || 0);
        } catch (error) {
          console.error("Error creating table:", error);
        }
      },
      [getBalance, user]
    );
    

    const onJoinTable = useCallback(
      (name: string, balance: number, id: string) => {
        game.emit[SocketEmit.JoinTable](id, name, balance)
      },
      [getBalance, user]
    )

    useEffect(() => {
      const handleTableCreated = (
        table: string,
        player: string,
        chat: string
      ) => {
        game.onTableCreated(
          JSON.parse(table),
          JSON.parse(player),
          JSON.parse(chat)
        );
        if (game.table && game.player) {
          navigate(`/table?id=${game.table.id}`);
        }
        game.modalUpdate(true);
  
        const soundSettings = game.music?.getLoacaleSettings();
        if (soundSettings) {
          const { musicVolume, soundsVolume } = soundSettings;
          game.music?.setMusicVolume(musicVolume);
          game.music?.setSoundVolume(soundsVolume);
        } else {
          game.music?.setMusicVolume(0.1);
        }
  
        game.music?.bg?.play();
      };
  
      const handleError = () => {
        const tableIdInput = document.querySelector<HTMLInputElement>(
          'input[name="tableId"]'
        );
        if (tableIdInput) {
          tableIdInput.value = '';
        }
      };
  
      socket.on(SocketOn.TableCreated, handleTableCreated);
      socket.on(SocketOn.Error, handleError);
  
      return () => {
        socket.off(SocketOn.TableCreated, handleTableCreated);
        socket.off(SocketOn.Error, handleError);
      };
    }, [navigate]);
  

    
    function handleLogout() {
      try {
        userbase
          .signOut()
          .then(() => {
            // user logged out
            console.log("User logged out!");
            logout();
            // router.push("/");
            navigate("/")
        game.modalUpdate(false, ModalTypes.LogIn);

          })
          .catch((e: any) => console.error(e));

      } catch (error: any) {
        console.log(error);
      }
    }

    const onSubmit = useCallback(
      (data: FormValues) => {
        const {tableId, joinExistingTable} = data;
        const name = user?.username ? user?.username : '';
        onJoinTable(name, userBalance, tableId);
      },
      [onJoinTable]
    )
  return (
    <div className='w-full h-full'>
        <header className='w-full flex justify-around p-5'>
            <div>Dashboard</div>
            <div>
                <p>Username: {user?.username}</p>
                <p>UserWallet Address: {user?.scwAddress}</p>
                <p>User Balance: {userBalance} CFT</p>
                <StyledBtn
        type="submit"
        className="button buttonBlue"
        onClick={handleLogout}
      >
       Logout
      </StyledBtn>
            </div>

        </header>

        <section>
        <StyledBtn
        type="submit"
        onClick={() => createTable()}
        className="button buttonBlue"
      >
        Create Table
      </StyledBtn>

      <Form onSubmit={handleSubmit(onSubmit)}>
      <CheckboxInputWrapper>
      <ChecboxInput 
      id="checkbox"
      type='checkbox'
      className='checkbox-input'
      {...register('joinExistingTable')} 
      />
      <label className='fake-check' htmlFor='checkbox'></label>
      <CheckboxLabel>Join existing table</CheckboxLabel>
      </CheckboxInputWrapper>
      {watch('joinExistingTable') && (
        <InputWrapper>
        {errors.tableId && <ErrorMsg>{errors.tableId.message}</ErrorMsg>}
        <Input 
        autoComplete="off"
        className={`${watch('tableId') ? 'filled' : ''}`}
        type='text'
        {...register('tableId', {
          required: 'Table ID is required', 
        })}

        />
        <Label>Table Id:</Label>
        </InputWrapper>
      )}
      <StyledBtn
        type="submit"
        className="button buttonBlue"
      >
        Join Table
      </StyledBtn>
      </Form>


    
        </section>
    </div>
  )
}
