import { useQuery } from "@tanstack/react-query";
import { ApiResponse, getProjectsResponse } from "@/types/response";
import apiClient from "@/utils/apiClient";

export const getProjects = async (
  workspaceId: string
): Promise<ApiResponse<getProjectsResponse[]>> => {
  const response = await apiClient.get(`/projects/${workspaceId}`);
  return response.data;
};

export const useGetProjects = (workspaceId: string) => {
  return useQuery({
    queryKey: ["GET_PROJECTS", workspaceId],
    queryFn: () => getProjects(workspaceId),
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 mins
  });
};
