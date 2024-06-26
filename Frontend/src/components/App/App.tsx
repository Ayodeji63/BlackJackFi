import { Flip, ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

import { ModalsManager } from '../ModalsManager/ModalsManager';
import { SoundsContainer } from '../../sounds/SoundsContainer';
import { EnterPage } from '../../pages/EnterPage/EnterPage';
import { GamePage } from '../../pages/GamePage/GamePage';
import { SignUpForm } from "../ModalsManager/Modals/SignUpForm";
import { SignUpPage } from '../../pages/SignUp/SignUp';
import {Dashboard} from '../../pages/Dashboard/Dashboard';
export const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<EnterPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="/table" element={<GamePage />} />
      </Routes>
      <ToastContainer
        transition={Flip}
        newestOnTop={false}
        limit={3}
      />
      <ModalsManager />
      <SoundsContainer />
    </>
  );
};
