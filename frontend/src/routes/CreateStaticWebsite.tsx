import TitleHeader from "@/components/shared/TitleHeader";
import { useCreateProject } from "@/services/useCreateProject";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

export default function CreateStaticWebsite() {
  const { workspaceId } = useParams();

  const formSchema = z.object({
    project_name: z.string().min(2, {
      message: "Project name must be at least 2 characters.",
    }),
    project_description: z.string().optional(),
    bucket_name: z
      .string()
      .regex(/^[a-z0-9](?!.*\.\.)[a-z0-9.-]{1,61}[a-z0-9]$/, {
        message:
          "Invalid project name. Ensure it follows the AWS bucket naming rules.",
      })
      .min(3, {
        message: "Bucket name must be at least 3 characters.",
      })
      .max(63, {
        message: "Bucket name must be at most 63 characters.",
      }),
  });

  //api hooks
  const { mutate } = useCreateProject();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: "",
      project_description: "",
      bucket_name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    mutate({
      name: values.project_name,
      description: values.project_description,
      service: "s3",
      created_by: "123",
      workspace_id: workspaceId as string,
      provider: "aws",
      bucket_name: values.project_name.toLowerCase().replace(/\s+/g, "-"),
    });
  }
  return (
    <div>
      <TitleHeader title="Create Static Website" />
      <div className="p-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-lg mx-auto"
          >
            <FormField
              control={form.control}
              name="project_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bucket_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Create
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
