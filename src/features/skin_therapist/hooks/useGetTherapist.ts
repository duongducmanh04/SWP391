import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TherapistDto } from "../dto/get-therapist.dto";

const fetchTherapists = async (): Promise<TherapistDto[]> => {
  const response = await axios.get<TherapistDto[]>(
    "http://skincare-sbs.southeastasia.azurecontainer.io:8080/api/skintherapist/getAllSkintherapist"
  );
  return response.data;
};

export const useTherapists = () => {
  return useQuery<TherapistDto[], Error>({
    queryKey: ["getAllSkintherapist"],
    queryFn: fetchTherapists,
  });
};
