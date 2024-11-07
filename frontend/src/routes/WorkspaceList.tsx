import { Button } from "@/components/ui/button";
import { useGetWorkspaces } from "@/services/useGetWorkspaces";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/utils";

export default function WorkspaceList() {
  const navigate = useNavigate();
  const { data: workspaces } = useGetWorkspaces();

  return (
    <div>
      <div className="px-10 py-6 max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <h2 className="font-semibold text-xl">Workspaces</h2>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
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
        </header>
        <div className="grid grid-cols-3 gap-6">
          {workspaces?.data?.map((workspace) => (
            <Link
              to={`/workspace/${workspace.id}`}
              key={workspace.id}
              className="border flex flex-col justify-between p-4 rounded-lg bg-secondary h-40"
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
