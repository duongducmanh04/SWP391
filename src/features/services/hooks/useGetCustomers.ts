import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CustomerDto } from "../dto/customer.dto"; // ✅ Import DTO

// ✅ Fetch Customers from API
const fetchCustomers = async (): Promise<CustomerDto[]> => {
  const response = await axios.get<CustomerDto[]>("https://localhost:7071/getAllCustomers");
  return response.data;
};

// ✅ Custom Hook to Get Customers
export const useGetCustomers = () => {
  return useQuery<CustomerDto[], Error>({
    queryKey: ["getAllCustomers"],
    queryFn: fetchCustomers,
  });
};
