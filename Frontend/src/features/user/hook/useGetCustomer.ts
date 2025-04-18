import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CustomerDto } from "../dto/customer.dto";

const fetchCustomers = async (): Promise<CustomerDto[]> => {
  const response = await axios.get<CustomerDto[]>(
    "https://localhost:7071/getAllCustomers"
  );
  return response.data;
};

export const useCustomers = () => {
  return useQuery<CustomerDto[], Error>({
    queryKey: ["getAllCustomers"],
    queryFn: fetchCustomers,
  });
};
