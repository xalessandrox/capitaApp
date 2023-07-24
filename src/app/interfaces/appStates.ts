import { DataState } from "../enums/dataState.enum";
import { User } from "./user";

export interface LoginState {
  dataState: DataState;
  loginSuccess?: boolean;
  error?: string;
  message?: string;
  isUsingMfa?: boolean;
  phone?: string;
  email?: string;
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
  user?: User;
  access_token: string;
  refresh_token: string;
}