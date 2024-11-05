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
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="sm">
              Join Workspace
            </Button>
            <Button
              onClick={() => {
                navigate("/create-workspace");
              }}
              variant="default"
              size="sm"
            >
              Create Workspace
            </Button>
          </div>
        }
      />
      <div className="p-10">
        <div className="flex flex-wrap gap-6 mb-8">
          {workspaces?.data?.map((workspace) => (
            <Link
              to={`/workspace/${workspace.id}`}
              key={workspace.id}
              className="border flex flex-col justify-between p-4 rounded-lg bg-secondary w-96 h-36"
            >
              <div>
                <h3 className="font-medium mb-2">{workspace.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {workspace.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(workspace.created_at)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
