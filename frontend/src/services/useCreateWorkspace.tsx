import apiClient from "@/utils/apiClient";
import { ApiResponse } from "@/types/response";
import { CreateWorkspaceRequest } from "@/types/requests";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const createWorkspace = async (
  data: CreateWorkspaceRequest
): Promise<ApiResponse> => {
  const response = await apiClient.post("/api/workspace/create", data);
  return response.data;
};

export const useCreateWorkspace = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      if (data.data) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.error(error.response?.data?.message || error.message);
    },
  });
};
