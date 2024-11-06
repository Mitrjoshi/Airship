import TitleHeader from "@/components/shared/TitleHeader";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useGetProjects } from "@/services/useGetProjects";
import { formatDate } from "@/utils/utils";
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

export default function Workspace() {
  const { workspaceId } = useParams();

  const { data: projects } = useGetProjects(workspaceId as string);

  return (
    <div>
      <TitleHeader
        title={`Workspace: ${workspaceId}`}
        headerRight={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">
                Add New... <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Deployment Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <GlobeAltIcon strokeWidth={2} />
                  <span>Static Website</span>
                </DropdownMenuItem>
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
        }
      />
      <div className="p-10">
        <div className="flex items-start justify-start flex-wrap gap-6 mb-6">
          {projects?.data?.map((project) => (
            <Link
              to={`/project/${project.id}`}
              key={project.id}
              className="border flex flex-col justify-between p-4 rounded-lg bg-secondary w-96"
            >
              <h3 className="mb-2">{project.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {project.description}
              </p>
              <span className="text-xs text-muted-foreground">
                {formatDate(project.created_at)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// function CreateProjectDialog() {
//   const { workspaceId } = useParams();

//   const formSchema = z.object({
//     project_name: z.string().min(2, {
//       message: "Project name must be at least 2 characters.",
//     }),
//     project_service: z
//       .enum(["ec2", "lambda", "s3"])
//       .nullable()
//       .default(null)
//       .refine((val) => val !== null, {
//         message: "Project category is required.",
//       }),
//   });

//   //api hooks
//   const { mutate } = useCreateProject();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       project_name: "",
//       project_service: undefined,
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values);

//     mutate({
//       name: values.project_name,
//       service: values.project_service,
//       created_by: "35ed859f-0fb6-4c5d-8f27-45e13612beb8",
//       workspace_id: workspaceId as string,
//       provider: "aws",
//       bucket_name: values.project_name.toLowerCase().replace(/\s+/g, "-"),
//     });
//   }

//   return (
//     <Dialog
//       onOpenChange={(open) => {
//         if (!open) {
//           setTimeout(() => {
//             form.reset();
//           }, 200);
//         }
//       }}
//     >
//       <DialogTrigger>
//         <Button variant="default" size="sm">
//           Add New... <ChevronDownIcon />
//         </Button>
//       </DialogTrigger>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create Project</DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <FormField
//               control={form.control}
//               name="project_name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Project name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter project name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="project_service"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Services</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a service" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="static-site">Static Site</SelectItem>
//                       <SelectItem value="lambda">Lambda Function</SelectItem>
//                       <SelectItem value="ec2">EC2</SelectItem>
//                       <SelectItem value="cdn">
//                         Content Delivery Network (CDN)
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormDescription>
//                     You can manage email addresses in your
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex space-x-4 justify-end">
//               <Button type="submit">Create</Button>
//               <DialogClose>
//                 <Button type="button" variant="outline">
//                   Cancel
//                 </Button>
//               </DialogClose>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
