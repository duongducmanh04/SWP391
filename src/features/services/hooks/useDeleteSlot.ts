import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { SlotDto } from "../dto/slot.dto";

export const useCreateSlot = () => {
  return useMutation({
    mutationFn: async (newSlot: SlotDto) => {
      const response = await axios.post(
        `https://localhost:7071/api/slot/createSlot`,
        newSlot
      );
      return response.data;
    },
  });
};

export const useDeleteSlot = () => {
  return useMutation({
    mutationFn: async (slotId: number) => {
      const response = await axios.delete(
        `https://localhost:7071/api/slot/deleteSlot/${slotId}`
      );
      return response.data;
    },
  });
};
