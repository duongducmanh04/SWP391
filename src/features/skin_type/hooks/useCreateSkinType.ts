import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { SkinDto } from "../dto/skin.dto";

interface CreateSkinTypeInput {
  skintypeId?: number;
  skintypeName: string;
  description: string;
  image: string;
  status: string;
  pros: string;
  cons: string;
  skincareGuide: string;
  introduction: string;
}

const createSkinType = async (
  skinType: CreateSkinTypeInput
): Promise<SkinDto> => {
  const response = await axios.post<SkinDto>(
    "https://localhost:7071/api/skintype/createSkintype",
    skinType
  );
  return response.data;
};

export const useCreateSkinType = () => {
  return useMutation<SkinDto, Error, CreateSkinTypeInput>({
    mutationFn: createSkinType,
  });
};
