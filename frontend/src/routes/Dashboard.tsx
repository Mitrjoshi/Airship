import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateWorkspace } from "@/services/useCreateWorkspace";
import TitleHeader from "@/components/shared/TitleHeader";
import { useGetWorkspaces } from "@/services/useGetWorkspaces";
import { Link } from "react-router-dom";

const formSchema = z.object({
  workspace_name: z.string().min(2, {
    message: "Workspace name must be at least 2 characters.",
  }),
  workspace_description: z.string().optional(),
});

export default function Dashboard() {
  const { data: workspaces, isLoading: isFetchingWorkspaces } =
    useGetWorkspaces();

  const { mutate } = useCreateWorkspace();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspace_name: "",
      workspace_description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      name: values.workspace_name,
      description: values.workspace_description,
      created_by: "35ed859f-0fb6-4c5d-8f27-45e13612beb8",
    });
  }

  return (
    <div>
      <TitleHeader title="Create a workspace" />
      <div className="p-10">
        <div className="flex flex-wrap gap-6 mb-8">
          {workspaces?.data?.map((workspace) => (
            <Link
              to={`/workspace/${workspace.id}`}
              key={workspace.id}
              className="border flex flex-col justify-between p-4 rounded-lg bg-gray-900 w-96"
            >
              <h3 className="mb-2">{workspace.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {workspace.description}
              </p>
              <span className="text-xs text-muted-foreground">
                {workspace.created_at}
              </span>
            </Link>
          ))}
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mx-auto max-w-xl"
          >
            <FormField
              control={form.control}
              name="workspace_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Example: Your company name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workspace_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace description (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your workspace description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4 justify-end">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
