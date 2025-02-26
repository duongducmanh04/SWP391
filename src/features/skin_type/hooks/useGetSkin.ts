import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SkinDto } from "../dto/Skin.dto";

const fetchSkinTypes = async (): Promise<SkinDto[]> => {
  const response = await axios.get<SkinDto[]>(
    "http://skincare-sbs.southeastasia.azurecontainer.io:8080/api/skintype/getAllSkintypes"
  );
  return response.data;
};

export const useSkinTypes = () => {
  return useQuery<SkinDto[], Error>({
    queryKey: ["getAllSkintypes"],
    queryFn: fetchSkinTypes,
  });
};
