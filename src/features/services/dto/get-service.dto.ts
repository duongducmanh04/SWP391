export interface ServiceDto {
  serviceId: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  procedureDescription: string;
  image: string;
  createdAt: Date;
  averageStars: number;
}
