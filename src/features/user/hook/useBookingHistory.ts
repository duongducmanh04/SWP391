import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BookingDto } from "../../booking/dto/booking.dto";
import { useGetCustomerId } from "../../user/hook/useGetCustomerId";

const API_BASE_URL = "https://localhost:7071/api/Booking";

// Hàm fetch dữ liệu booking history
const fetchBookingHistory = async (
  customerId: number
): Promise<BookingDto[]> => {
  if (!customerId || customerId <= 0) {
    throw new Error("Customer ID không hợp lệ");
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

  console.log("customerId lấy được:", customerId);

  const isCustomerIdValid = typeof customerId === "number" && customerId > 0;

  const bookingQuery = useQuery<BookingDto[], Error>({
    queryKey: ["getBookingHistory", customerId],
    queryFn: () => {
      if (!isCustomerIdValid) {
        return Promise.reject(new Error("Customer ID không hợp lệ"));
      }
      return fetchBookingHistory(customerId);
    },
    enabled: isCustomerIdValid,
    select: (data) => {
      return data.sort((a, b) => {
        // Ưu tiên các lịch có trạng thái "Booked"
        if (a.status === "Booked" && b.status !== "Booked") return -1;
        if (a.status !== "Booked" && b.status === "Booked") return 1;
        // Sau đó sắp xếp theo ngày đặt lịch mới nhất (date) lên đầu
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    },
  });

  return {
    ...bookingQuery,
    isLoading: isCustomerLoading || bookingQuery.isLoading,
    error: customerError || bookingQuery.error,
  };
};
