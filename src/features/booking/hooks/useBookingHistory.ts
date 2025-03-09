import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BookingDto } from "../dto/booking.dto";
import { useGetCustomerId } from "../../user/hook/useGetCustomerId";

const API_BASE_URL = "https://localhost:7071/api/Booking";

// Hàm fetch dữ liệu booking history
const fetchBookingHistory = async (
  customerId: number
): Promise<BookingDto[]> => {
  if (!customerId || customerId <= 0) {
    throw new Error("Customer ID không hợp lệ"); // Tránh gọi API nếu customerId không hợp lệ
  }
  const response = await axios.get<BookingDto[]>(
    `${API_BASE_URL}/previousBooking/${customerId}`
  );
  return response.data;
};

// Hook lấy lịch sử đặt lịch
export const useBookingHistory = () => {
  const {
    customerId,
    isLoading: isCustomerLoading,
    error: customerError,
  } = useGetCustomerId();

  console.log("customerId lấy được:", customerId); // Debug customerId

  // Kiểm tra nếu customerId hợp lệ
  const isCustomerIdValid = typeof customerId === "number" && customerId > 0;

  const bookingQuery = useQuery<BookingDto[], Error>({
    queryKey: ["getBookingHistory", customerId],
    queryFn: () => {
      if (!isCustomerIdValid) {
        return Promise.reject(new Error("Customer ID không hợp lệ")); // ✅ Tránh gọi API nếu không hợp lệ
      }
      return fetchBookingHistory(customerId); // ✅ Không cần `!` vì đã kiểm tra trước đó
    },
    enabled: isCustomerIdValid, // ✅ Chỉ chạy query nếu customerId hợp lệ
  });

  return {
    ...bookingQuery,
    isLoading: isCustomerLoading || bookingQuery.isLoading, // Gộp trạng thái loading từ useGetCustomerId
    error: customerError || bookingQuery.error, // Gộp lỗi từ useGetCustomerId và query
  };
};

// Interface cho mutation
interface MutationVariables {
  BookingId: number;
}

// Hook dùng để hủy lịch đặt
export const useCancelledBooking = () => {
  const queryClient = useQueryClient(); // ✅ Đã sử dụng nên không còn lỗi eslint

  return useMutation<void, Error, MutationVariables>({
    mutationFn: async ({ BookingId }: MutationVariables): Promise<void> => {
      await axios.put(`${API_BASE_URL}/cancelled/${BookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getBookingHistory"] }); // Làm mới dữ liệu booking history sau khi hủy lịch
    },
  });
};
