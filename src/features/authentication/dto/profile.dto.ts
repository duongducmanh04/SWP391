export interface LoginDto {
  accountId: number;
  accountName: string;
  role: string;
  active: boolean;
  customer: [];
  skinTherapists: [];
}

export interface LoginResponseDto {
  message: string;
  accountId: number;
  role: string;
  token: string;
}
