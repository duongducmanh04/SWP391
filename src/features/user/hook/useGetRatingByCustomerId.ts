import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RatingDto } from "../../services/dto/rating.dto";

export const useGetLatestRatingByCustomerId = (
  customerId?: number,
  serviceId?: number,
  bookingId?: number
) => {
  return useQuery<RatingDto | null>({
    queryKey: ["latestRating", customerId, serviceId, bookingId], // ✅ Thêm bookingId vào key
    queryFn: async () => {
      if (!customerId || !serviceId || !bookingId) return null;

      const response = await axios.get<RatingDto[]>(
        `https://skincareservicebooking.onrender.com/api/Rating/customer/${customerId}`,
        { headers: { Accept: "application/json" } }
      );

      console.log("📥 Nhận dữ liệu rating từ API:", response.data);

      // 🎯 Lọc rating theo `customerId`, `serviceId`, và `bookingId`
      const ratingsForBooking = response.data.filter(
        (r) =>
          r.serviceId === serviceId &&
          r.customerId === customerId &&
          r.bookingId === bookingId // ✅ Lọc theo bookingId
      );

      if (ratingsForBooking.length === 0) return null;

      // 🏆 Lấy rating mới nhất dựa trên `ratingId` và `createAt`
      return ratingsForBooking.sort((a, b) => {
        if (b.ratingId !== a.ratingId) {
          return b.ratingId - a.ratingId;
        }
        return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
      })[0];
    },
    enabled: !!customerId && !!serviceId && !!bookingId, // ✅ Chỉ fetch khi đủ thông tin
  });
};
