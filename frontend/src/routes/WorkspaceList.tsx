import { Button } from "@/components/ui/button";
import TitleHeader from "@/components/shared/TitleHeader";
import { useGetWorkspaces } from "@/services/useGetWorkspaces";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { WorkspaceCards } from "@/components/cards/WorkspaceCards";
import { Loading } from "@/components/shared/Loading";

export default function WorkspaceList() {
  const navigate = useNavigate();
  const { data: workspaces, isLoading } = useGetWorkspaces();

  return (
    <>
      <TitleHeader
        headerRight={
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="sm">
              Join Workspace
            </Button>
            <Button
              onClick={() => {
                navigate("create");
              }}
              variant="default"
              size="sm"
            >
              Create Workspace
            </Button>
          </div>
        }
      />

      <MainLayout className="p-10">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {workspaces?.data?.map((workspace, index) => (
              <WorkspaceCards key={index} data={workspace} />
            ))}
          </div>
        )}
      </MainLayout>
    </>
  );
}
