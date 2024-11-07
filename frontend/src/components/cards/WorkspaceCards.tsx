import { getProjectsResponse } from "@/types/response";
import { formatDate } from "@/utils/utils";
import { Link } from "react-router-dom";

export const WorkspaceCards = ({ data }: { data: getProjectsResponse }) => {
  return (
    <Link
      to={`/workspace/${data.id}`}
      key={data.id}
      className="border flex flex-col justify-between p-4 rounded-lg bg-secondary h-44"
    >
      <div>
        <h3 className="font-medium mb-2">{data.name}</h3>

        <p className="text-sm text-muted-foreground">{data.description}</p>
      </div>
      <div className="flex justify-between items-center gap-4">
        <span className="text-xs text-muted-foreground">
          {formatDate(data.created_at)}
        </span>
        <p className="text-sm text-muted-foreground">{data.created_by}</p>
      </div>
    </Link>
  );
};
