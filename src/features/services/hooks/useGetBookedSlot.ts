import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SlotDto } from "../dto/slot.dto";

const fetchBookedSlots = async (): Promise<SlotDto[]> => {
  const response = await axios.get<SlotDto[]>(
    "https://localhost:7071/api/slot/getBookedSlots"
  );
  return response.data;
};

export const useBookedSlot = () => {
  return useQuery<SlotDto[], Error>({
    queryKey: ["getAllBookings"],
    queryFn: fetchBookedSlots,
  });
};
