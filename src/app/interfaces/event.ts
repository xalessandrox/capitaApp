import { EventType } from "../enums/event-type.enum";

export interface Events {

  id: number;
  type: EventType;
  description: string;
  device: string;
  ipAddress: string;
  createdAt: Date;

}
