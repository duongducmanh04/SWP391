import { useCustomers } from "./useGetCustomer";
import useAuthStore from "../../authentication/hooks/useAuthStore";

export const useGetCustomerId = () => {
  const { user } = useAuthStore();
  const { data: customers, isLoading, error } = useCustomers();

  console.log("Auth user:", user);
  console.log("Customers data:", customers);
  console.log("Loading state:", isLoading);
  console.log("Error state:", error);

  if (isLoading) return { customerId: null, isLoading, error };
  if (error) return { customerId: null, isLoading, error };

  const userAccountId = Number(user?.accountId);

  const customer = customers?.find(
    (c) => Number(c.accountId) === userAccountId
  );

  console.log("Matched customer:", customer);

  return { customerId: customer?.customerId ?? null, isLoading, error };
};
