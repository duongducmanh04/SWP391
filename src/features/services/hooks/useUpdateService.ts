import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ServiceDto } from "../dto/get-service.dto";

interface MutationVariables {
  serviceId: string;
  data: ServiceDto;
}

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, MutationVariables>({
    mutationFn: async ({
      serviceId,
      data,
    }: MutationVariables): Promise<void> => {
      await axios.put(
        `https://localhost:7071/api/service/update/${serviceId}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["update"] });
    },
  });
};
