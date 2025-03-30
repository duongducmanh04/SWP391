import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CustomerDto } from "../dto/customer.dto";

interface UpdateCustomerParams {
  accountId: number;
  role: string;
  updateData: Partial<CustomerDto>; // Chỉ cập nhật một phần dữ liệu
}

// Hàm gọi API cập nhật thông tin khách hàng
const updateCustomer = async ({
  accountId,
  role,
  updateData,
}: UpdateCustomerParams): Promise<CustomerDto | null> => {
  const response = await axios.put(
    `https://skincareservicebooking.onrender.com/updateCustomer/${accountId}/${role}`,
    updateData
  );

  return response.data || null;
};

// Hook sử dụng React Query để cập nhật dữ liệu
export const useUpdateCustomer = () => {
  return useMutation<CustomerDto | null, Error, UpdateCustomerParams>({
    mutationFn: updateCustomer,
  });
};
