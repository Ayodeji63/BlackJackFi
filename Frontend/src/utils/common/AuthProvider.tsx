import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import userbase from 'userbase-js';


interface User {
    username: string;
    isLoggedIn: boolean;
    userId: string;
    scwAddress?: string;
}