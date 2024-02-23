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
import { SocketEmit, SocketOn } from '../../../types.ds';
import { StyledBtn } from '../../App/App.styled';
import { socket } from '../../../server/socket';
import { game } from '../../../store/game';




interface FormValues {
  username: string;
  password: string;
}

export const SignUpForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormValues>();
  const {user, login} = useAuth();

  const [disabled, setDisabled] = useState<boolean>(false);
  const navigate = useNavigate();

  const ALCHEMY_API_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`;
  const AA_APIKEY = process.env.REACT_APP_ALCHEMY_API_KEY;
  const chain = sepolia;

  const ENTRYPOINT_ADDRESS = process.env
  .SEPOLIA_ENTRYPOINT_ADDRESS as `0x${string}`;
const SIMPLE_ACCOUNT_FACTORY_ADDRESS = process.env
  .SEPOLIA_SIMPLE_ACCOUNT_FACTORY_ADDRESS as `0x${string}`;


  
  const handleSignup = async (username: string, password: string) => {
      try {
        const privKey = secp.utils.randomPrivateKey();
        const privKeyHex = secp.etc.bytesToHex(privKey);
        
        // Use the static method directly on the LocalAccountSigner class
        const signer = LocalAccountSigner.privateKeyToAccountSigner(`0x${privKeyHex}`);
        
        // Now you can proceed with the rest of your code
        const provider = await createLightAccountAlchemyClient({
          apiKey: AA_APIKEY,
          chain,
          signer,
        });
        

        const userScwAddress = provider.getAddress();
        

      
        // const userScwAddress: string = (await publicClient.readContract({
        //   address: "0x9406Cc6185a346906296840746125a0E44976454", // simple factory addr
        //   abi: simpleFactoryAbi,
        //   functionName: "getAddress",
        //   args: [ownerAddress, 0],
        // })) as string;

        const response2 = await userbase.signUp({
          username,
          password,
          rememberMe: "local",
          profile: {
            scwAddress: userScwAddress,
            pk: privKeyHex,
          },
        });

        const userInfo = {
          username: username,
          isLoggedIn: true, 
          userId: response2.userId,
          scwAddress: userScwAddress,
        };
        login(userInfo);

      } catch (error) {
        alert(error);
        
      }
    }

  const onSubmit = useCallback(
    (data: FormValues) => {
      setDisabled(true);
      const { username, password } = data;
      handleSignup(username, password);
    },
    [handleSignup]
  );



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
            minLength: {
              value: 3,
              message: 'Name should be at least 3 characters',
            },
            maxLength: {
              value: 25,
              message: 'Name should not exceed 25 characters',
            },
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
            minLength: {
              value: 8,
              message: 'Password should be at least 3 characters',
            },
        
          })}
        />
        <Label>Password:</Label>
      </InputWrapper>
      <StyledBtn
        type="submit"
        className="button buttonBlue"
        disabled={disabled}
      >
       SignUp
      </StyledBtn>
    </Form>
  );
};
