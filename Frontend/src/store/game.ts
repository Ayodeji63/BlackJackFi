/* eslint-disable no-console */
import { toast } from "react-toastify";
import { makeObservable } from "mobx";
import equal from "fast-deep-equal";
import { observable } from "mobx";
import { computed } from "mobx";
import { action } from "mobx";

import { toastSettings } from "../components/App/App.styled";
import { EndGameActions } from "../types.ds";
import { socket } from "../server/socket";
import { ActionType } from "../types.ds";
import { ModalTypes } from "../types.ds";
import { SocketEmit } from '../types.ds';
import { SoundType } from '../types.ds';
import { IMessage } from '../types.ds';
import { SocketOn } from '../types.ds';
import { IPlayer } from '../types.ds';
import { IModal } from '../types.ds';
import { ITable } from '../types.ds';
import { IChat } from '../types.ds';
import { Dealer } from './dealer';
import { Player } from './player';
import { Music } from './music';
import { Table } from './table';
import { Card } from './card';
import { Chat } from './chat';