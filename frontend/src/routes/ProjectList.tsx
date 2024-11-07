import TitleHeader from "@/components/shared/TitleHeader";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useGetProjects } from "@/services/useGetProjects";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CloudIcon,
  GlobeAltIcon,
  ServerStackIcon,
} from "@heroicons/react/24/outline";
import MainLayout from "@/components/layouts/MainLayout";
import { ProjectsCards } from "@/components/cards/ProjectsCards";
import { Loading } from "@/components/shared/Loading";

export default function ProjectList() {
  const { workspaceId } = useParams();

  const { data: projects, isLoading } = useGetProjects(workspaceId as string);

  return (
    <>
      <TitleHeader
        headerRight={
          <div className="flex gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  Add New... <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Deployment Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to="create-static-website">
                    <DropdownMenuItem>
                      <GlobeAltIcon strokeWidth={2} />
                      <span>Static Website</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <img
                      className="size-4 invert mix-blend-difference"
                      src="/lambda.png"
                      alt=""
                    />
                    <span>Lambda Function</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ServerStackIcon strokeWidth={2} />
                    <span>Elastic Compute Cloud</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CloudIcon strokeWidth={2} />
                    <span>Content Delivery Network</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <MainLayout className="p-10">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {projects?.data?.map((project, index) => (
              <ProjectsCards key={index} data={project} />
            ))}
          </div>
        )}
      </MainLayout>
    </>
  );
}
