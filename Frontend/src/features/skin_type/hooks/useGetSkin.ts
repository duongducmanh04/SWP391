import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SkinDto } from "../dto/skin.dto";

const fetchSkinTypes = async (): Promise<SkinDto[]> => {
  const response = await axios.get<SkinDto[]>(
    "https://localhost:7071/api/skintype/getAllSkintypes"
  );
  return response.data;
};

export const useSkinTypes = () => {
  return useQuery<SkinDto[], Error>({
    queryKey: ["getAllSkintypes"],
    queryFn: fetchSkinTypes,
  });
};
