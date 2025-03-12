import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const deleteSkinType = async (skinTypeId: number): Promise<string> => {
  const response = await axios.delete<string>(
    `https://localhost:7071/api/skintype/deleteSkintype/${skinTypeId}`
  );
  return response.data;
};

export const useDeleteSkinType = () => {
  return useMutation<string, Error, number>({
    mutationFn: deleteSkinType,
  });
};
