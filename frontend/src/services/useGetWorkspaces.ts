import { useQuery } from "@tanstack/react-query";
import { ApiResponse, getProjectsResponse } from "@/types/response";
import apiClient from "@/utils/apiClient";

export const getWorkspaces = async (): Promise<
  ApiResponse<getProjectsResponse[]>
> => {
  const response = await apiClient.get("/workspace");
  return response.data;
};

export const useGetWorkspaces = () => {
  return useQuery({
    queryKey: ["GET_WORKSPACES"],
    queryFn: getWorkspaces,
    staleTime: 5 * 60 * 1000, // 5 mins
  });
};
