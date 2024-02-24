/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as secp from '@noble/secp256k1';
import { useAuth } from '../../../utils/common/AuthProvider';
import userbase from 'userbase-js';
import { publicClient } from '../../../utils/client';
import simpleFactoryAbi from '../../../utils/SimpleAccountFactory.json';
import axios from 'axios';
import { createLightAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { LocalAccountSigner, sepolia, type Hex } from "@alchemy/aa-core";


import {
  CheckboxInputWrapper,
  CheckboxLabel,
  InputWrapper,
  ChecboxInput,
  ErrorMsg,
  Input,
  Label,
  Form,
} from '../ModalsManager.styled';
import { ModalTypes, SocketEmit, SocketOn } from '../../../types.ds';
import { StyledBtn } from '../../App/App.styled';
import { socket } from '../../../server/socket';
import { game } from '../../../store/game';




interface FormValues {
  username: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormValues>();
  const {user, login, logout} = useAuth();

  const [disabled, setDisabled] = useState<boolean>(false);
  const navigate = useNavigate();

  const ALCHEMY_API_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`;
  const AA_APIKEY = process.env.REACT_APP_ALCHEMY_API_KEY;
  const chain = sepolia;

  const ENTRYPOINT_ADDRESS = process.env
  .SEPOLIA_ENTRYPOINT_ADDRESS as `0x${string}`;
const SIMPLE_ACCOUNT_FACTORY_ADDRESS = process.env
  .SEPOLIA_SIMPLE_ACCOUNT_FACTORY_ADDRESS as `0x${string}`;


  
  
  const handleLogin = async (username: string, password: string) => {
      try {
        const response = await userbase.signIn({
            username,
            password,
            rememberMe: "local",
        });

        console.log(`Response is: `, response);

        const userInfo = {
            username: username,
            isLoggedIn: true,
            userId: response.userId,
            userScwAddress: response.profile?.scwAddress,
        }
        login(userInfo);
        if (user?.isLoggedIn) {
            navigate("/dashboard");
            console.log(`Userbase login succesful on Login page. ✅ Welcome, ${username}!`);
        }

      } catch (error) {
        console.log(error);
        
      }
    }

  const gotoSignUp = () => {
    game.modalUpdate(false, ModalTypes.SignUp);

  }

  // const onSubmit = useCallback(
  //   (data: FormValues) => {
  //     setDisabled(true);
  //     const { username, password } = data;
  //     handleSignup(username, password);
  //   },
  //   [handleSignup]
  // );

  const onSubmit = (data: FormValues) => {
    setDisabled(true);
    const {username, password} = data;
    handleLogin(username, password);
  }




  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper>
          {errors.username && <ErrorMsg>{errors.username.message}</ErrorMsg>}
          <Input
            autoComplete="off"
            className={`${watch('username') ? 'filled' : ''}`}
            type="text"
            {...register('username', {
              required: 'Name is required',
            })}
          />
          <Label>User Name:</Label>
        </InputWrapper>
        <InputWrapper>
          {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
          <Input
            autoComplete="off"
            className={`${watch('password') ? 'filled' : ''}`}
            type="password"
            {...register('password', {
              required: 'Password is required',
            })}
          />
          <Label>Password:</Label>
        </InputWrapper>
        <StyledBtn
          type="submit"
          className="button buttonBlue"
          disabled={disabled}
        >
         Log In
        </StyledBtn>

        <p className='cursor-pointer mt-4 text-blue-200' onClick={gotoSignUp}>Create An Account</p>
      
      </Form>
      
  
  );
};
