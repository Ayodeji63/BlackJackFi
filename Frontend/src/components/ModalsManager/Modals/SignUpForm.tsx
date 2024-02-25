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
import { LocalAccountSigner, baseSepolia, polygonMumbai, arbitrumSepolia,  type Hex, UserOperationOverrides, SendUserOperationResult } from "@alchemy/aa-core";


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
import { encodeFunctionData, parseEther } from 'viem';
import casinoFiAbi from "../../../CasinoFiToken.json";




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
  const {user, login, logout} = useAuth();

  const [disabled, setDisabled] = useState<boolean>(false);
  const navigate = useNavigate();

  const ALCHEMY_API_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`;
  const AA_APIKEY = String(process.env.REACT_APP_BASE_SEPOLIA_API_KEY);
  const chain = baseSepolia;

  const ENTRYPOINT_ADDRESS = process.env
  .SEPOLIA_ENTRYPOINT_ADDRESS as `0x${string}`;
const SIMPLE_ACCOUNT_FACTORY_ADDRESS = process.env
  .SEPOLIA_SIMPLE_ACCOUNT_FACTORY_ADDRESS as `0x${string}`;

  
  useEffect(() => {
    if (user?.isLoggedIn) {
      game.modalUpdate(true);
      navigate("/dashboard");   
    }
    setDisabled(false);
  }, [user])
  // "0xfeC9b3325A31a38E17140D0Cb248E10a58EBe3aD"
  
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
          gasManagerConfig: {
            policyId: String(process.env.REACT_APP_BASE_SEPOLIA_POLICY_ID)
          }
        });
        const userScwAddress = provider.getAddress();

        const response2 = await userbase.signUp({
          username,
          password,
          rememberMe: "local",
          profile: {
            scwAddress: userScwAddress,
            pk: privKeyHex,
          },
        });

        console.log(`response is`, response2);

        const userInfo = {
          username: username,
          isLoggedIn: true, 
          userId: response2.userId,
          scwAddress: userScwAddress,
          privateKey: privKeyHex
        };
        login(userInfo);

        const data = encodeFunctionData({
          abi: casinoFiAbi,
          functionName: "mintForEarlyUsers",
          args: [],
        });

        const amountToSend: bigint = parseEther("0");
        const contractAddress = process.env.REACT_APP_CASINOFI_TOKEN_ADDRESS_ARB as `0x${string}`;

        const { hash: uoHash } = await provider.sendUserOperation({
          uo: {
            target: contractAddress, // The desired target contract address
            data: data, // The desired call data
            value: amountToSend, // (Optional) value to send the target contract address
          },
        });

        console.log(uoHash); // Log the transaction hash

        
          console.log(`Userinfo is: `, userInfo);
          game.modalUpdate(true);
          navigate("/dashboard");   

      } catch (error) {
        console.log(error);
        
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
