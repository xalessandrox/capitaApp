import { DataState } from "../enums/dataState.enum";
import { User } from "./user";
import { Events } from "./event";
import { Role } from "./role";
import { Customer } from "./customer";

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
  access_token?: string;
  refresh_token?: string;
}

export interface Page<T> {
  content?: T[];
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
  size?: number;
  number?: number;
}

export interface PageContent {
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
  size?: number;
  number?: number;
}

export interface CustomerState {
  user: User,
  customer: Customer
}

export interface RegisterState {
  dataState: DataState,
  registerSuccess?: boolean,
  error?: string,
  message?: string
}