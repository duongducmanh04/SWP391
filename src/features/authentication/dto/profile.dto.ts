export interface SkintherapistProfileDto {
  accountId: number;
  accountName: string;
  password: string;
  role: string;
  active: boolean;
  customer: string;
  skinTherapists: [
    {
      skintherapistId: number;
      name: string;
      speciality: string;
      email: string;
      experience: string;
      image: string;
      degree: string;
      accountId: number;
    }
  ];
}

export interface CustomerProfileDto {
  accountId: number;
  accountName: string;
  password: string;
  role: string;
  active: boolean;
  customer: [
    {
      customerId: number;
      name: string;
      skintypeId: number;
      accountId: number;
      phoneNumber: string;
      image: string;
      email: string;
    }
  ];
  skinTherapists: string;
}
