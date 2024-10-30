/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/utils/apiClient";
import { ApiResponse } from "@/types/response";
import { CreateProjectRequest } from "@/types/requests";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const createProject = async (
  data: CreateProjectRequest
): Promise<ApiResponse> => {
  const response = await apiClient.post("/projects/create", data);
  return response.data;
};

export const useCreateProject = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      if (data.data) {
        navigate(`/project/${data.data.projectId}`);
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
