import { Invoice } from "./invoice";

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  type: string;
  status: string;
  imageUrl?: string;
  phone?: string;
  createdAt: Date;
  invoices?: Invoice[];
}
