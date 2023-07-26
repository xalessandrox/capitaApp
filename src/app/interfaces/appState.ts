import { DataState } from "../enums/dataState.enum";

export interface AppState<T> {
  dataState: DataState,
  appData?: T,
  error?: string
}
