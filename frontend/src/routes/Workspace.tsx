import TitleHeader from "@/components/shared/TitleHeader";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";

const formSchema = z.object({
  project_name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  project_service: z
    .enum(["ec2", "lambda", "s3"])
    .nullable()
    .default(null)
    .refine((val) => val !== null, {
      message: "Project category is required.",
    }),
});

export default function Workspace() {
  const { workspaceId } = useParams();
  const [formStep, setFormStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: "",
      project_service: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setFormStep(formStep + 1);
  }

  return (
    <div>
      <TitleHeader title={`Workspace: ${workspaceId}`} />
      <div className="flex justify-center items-center p-10">
        <Dialog
          onOpenChange={(open) => {
            if (!open) {
              setTimeout(() => {
                setFormStep(1);
                form.reset();
              }, 200);
            }
          }}
        >
          <DialogTrigger>
            <Button variant="outline">Create Project +</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
            </DialogHeader>

            {formStep === 1 && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
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
                    name="project_service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Services</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="s3">S3</SelectItem>
                            <SelectItem value="lambda">Lambda</SelectItem>
                            <SelectItem value="ec2">EC2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          You can manage email addresses in your
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4 justify-end">
                    <Button type="submit">Next</Button>
                    <DialogClose>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                  </div>
                </form>
              </Form>
            )}

            {formStep === 2 && <></>}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
