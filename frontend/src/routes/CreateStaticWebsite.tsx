import { useCreateProject } from '@/services/useCreateProject'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import { Switch } from '@/components/ui/switch'

export default function CreateStaticWebsite() {
  const { workspaceId } = useParams()

  const formSchema = z.object({
    project_name: z.string().min(2, {
      message: 'Project name must be at least 2 characters.'
    }),
    project_description: z.string().optional(),
    bucket_name: z
      .string()
      .regex(/^[a-z0-9](?!.*\.\.)[a-z0-9.-]{1,61}[a-z0-9]$/, {
        message: 'Invalid project name. Ensure it follows the AWS bucket naming rules.'
      })
      .min(3, {
        message: 'Bucket name must be at least 3 characters.'
      })
      .max(63, {
        message: 'Bucket name must be at most 63 characters.'
      }),
    caching: z.boolean().default(false).optional()
  })

  //api hooks
  const { mutate, isPending } = useCreateProject()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: '',
      project_description: '',
      bucket_name: ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    mutate({
      name: values.project_name,
      description: values.project_description,
      service: 's3',
      created_by: '123',
      workspace_id: workspaceId as string,
      provider: 'aws',
      bucket_name: values.bucket_name
    })
  }
  return (
    <div>
      <div className='p-10'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='mx-auto max-w-lg space-y-8'>
            <FormField
              control={form.control}
              name='project_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter project name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='project_description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project description</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter project description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bucket_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bucket name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter bucket name' {...field} />
                  </FormControl>
                  <FormMessage />
                  {/* <div className="flex items-center space-x-2">
                    <a
                      className="text-sm"
                      href="http://"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      See rules
                    </a>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  </div> */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='caching'
              render={({ field }) => (
                <FormItem className='rounded-lg border p-4'>
                  <div className='flex flex-row items-start justify-between'>
                    <FormLabel className='text-sm'>Default Cache Behavior</FormLabel>

                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Configure CloudFront cache behavior for static S3 content. Set cache-control, protocols, and TTL to
                    optimize delivery and control update frequency.
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button loading={isPending} className='w-full' type='submit'>
              Create
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
