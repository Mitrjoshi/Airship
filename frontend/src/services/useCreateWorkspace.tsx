import apiClient from "@/utils/apiClient";
import { ApiResponse } from "@/types/response";
import { CreateWorkspaceRequest } from "@/types/requests";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const createWorkspace = async (
  data: CreateWorkspaceRequest
): Promise<ApiResponse> => {
  const response = await apiClient.post("/workspace/create", data);
  return response.data;
};

export const useCreateWorkspace = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      if (data.data) {
        navigate(`/workspace/${data.data.uuid}`);
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
