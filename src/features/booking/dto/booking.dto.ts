export interface BookingDto {
  bookingId: number;
  customerId: number;
  location: string;
  date: string;
  createdAt: string;
  status: string;
  amount: number;
  skintherapistId: number;
  skintherapistName: string;
  serviceName: string;
  serviceId: number;
  note: string;

  customer: string;
  updateAt: string;
}
