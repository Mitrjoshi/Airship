import TitleHeader from '@/components/shared/TitleHeader'
import { useCreateProject } from '@/services/useCreateProject'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useParams } from 'react-router-dom'
import { FormPageContainer } from '@/components/shared/FormPageContainer'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AWS_REGIONS } from '@/constants'
import LoadingButton from '@/components/shared/LoadingButton'

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
    multipleEnv: z.boolean().default(false),
    region: z.string().default('ap-south-1'),
    environment: z.enum(['staging', 'production']).optional().default('production')
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
    mutate({
      name: values.project_name.trim(),
      description: values.project_description?.trim(),
      type: 'static-website',
      created_by: '123',
      workspace_id: workspaceId as string,
      bucket_name: values.bucket_name.trim(),
      region: values.region,
      environment: values.environment
    })
  }

  const { isValid } = form.formState

  return (
    <FormPageContainer>
      <TitleHeader title='Create Static Website' showBackBtn />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                <div className='flex items-center space-x-2'>
                  <a
                    className='text-sm font-light underline underline-offset-2'
                    href='https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    See bucket naming rules
                  </a>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='region'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={'ap-south-1'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a region' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AWS_REGIONS.map((continent) => (
                      <SelectGroup>
                        <SelectLabel>{continent.continent}</SelectLabel>
                        {continent.regions.map((region) => (
                          <SelectItem className='' value={region.code}>
                            {`${region.city} (${region.code})`}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select an AWS region by continent and city.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='environment'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Environment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={'production'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a environment' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='staging'>Staging</SelectItem>
                    <SelectItem value='production'>Production</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton disabled={!isValid} isLoading={isPending} className='w-full' type='submit'>
            Create Now
          </LoadingButton>
        </form>
      </Form>
    </FormPageContainer>
  )
}
