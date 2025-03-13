import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { SkinDto } from "../dto/skin.dto";

export const useCreateSkin = () => {
  return useMutation({
    mutationFn: async (newSkin: SkinDto) => {
      const response = await axios.post(
        `https://localhost:7071/api/skintype/createSkintype`,
        newSkin
      );
      return response.data;
    },
  });
};
