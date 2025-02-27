export interface CreateBookingDto {
  customerId: number;
  location: string;
  date: Date;
  amount: number;
  skintherapistId: number;
  serviceName: string;
}
