import { DataState } from "../enums/dataState.enum";
import { User } from "./user";
import { Events } from "./event";
import { Role } from "./role";

export interface LoginState {
  dataState: DataState;
  loginSuccess?: boolean;
  message?: string;
  isUsingMfa?: boolean;
  phone?: string;
  email?: string;
  error?: string;
}

export interface CustomHttpResponse<T> {
  timeStamp: Date;
  statusCode: number;
  status: string;
  message: string;
  reason?: string;
  developerMessage?: string;
  data?: T
}

export interface Profile {
  user: User;
  events?: Events[];
  roles?: Role[];
  access_token: string;
  refresh_token: string;
}
