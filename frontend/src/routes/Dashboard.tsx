import { Button } from "@/components/ui/button";
import TitleHeader from "@/components/shared/TitleHeader";
import { useGetWorkspaces } from "@/services/useGetWorkspaces";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: workspaces } = useGetWorkspaces();

  return (
    <div>
      <TitleHeader
        title="Dashboard"
        headerRight={
          <Button
            onClick={() => {
              navigate("/create-workspace");
            }}
            variant="outline"
          >
            Create Workspace
          </Button>
        }
      />
      <div className="p-10">
        <div className="flex flex-wrap gap-6 mb-8">
          {workspaces?.data?.map((workspace) => (
            <Link
              to={`/workspace/${workspace.id}`}
              key={workspace.id}
              className="border flex flex-col justify-between p-4 rounded-lg bg-gray-900 w-96 h-36"
            >
              <h3 className="mb-2 font-medium">{workspace.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {workspace.description}
              </p>
              <span className="text-sm text-muted-foreground">
                {formatDate(workspace.created_at)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
