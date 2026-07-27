export enum UserRole {
  Customer = 'Customer',
  StoreManager = 'StoreManager',
  InventoryAnalyst = 'InventoryAnalyst',
  Ops = 'Ops',
  Marketing = 'Marketing',
  Admin = 'Admin'
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  storeId?: number;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}