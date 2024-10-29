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

const formSchema = z.object({
  workspace_name: z.string().min(2, {
    message: "Workspace name must be at least 2 characters.",
  }),
  workspace_description: z.string().optional(),
});

export default function Workspace() {
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
      <header className="p-4 border-b">Create a workspace</header>
      <div className="p-10">
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
                  <FormLabel>Workspace description</FormLabel>
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
