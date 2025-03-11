export interface TherapistDto {
  skintherapistId: number;
  name: string;
  speciality: string;
  email: string;
  experience: string;
  image: string;
  expertise: string;
  degree: string;
  accountId: number;
  serviceIds: number[]; // Thêm dòng này
}
