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
import { AWS_LAMBDA_RUNTIMES, AWS_REGIONS } from '@/constants'
import LoadingButton from '@/components/shared/LoadingButton'
import { Checkbox } from '@/components/ui/checkbox'

const items = [
  {
    id: 'arm64',
    label: 'arm64'
  },
  {
    id: 'x86_64',
    label: 'x86_64'
  }
] as const

export default function CreateLambdaFunction() {
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
    environment: z.enum(['staging', 'production']).optional().default('production'),
    items: z.string({
      message: 'You have to select at least one item.'
    })
  })

  //api hooks
  const { mutate, isPending } = useCreateProject()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: '',
      project_description: '',
      bucket_name: '',
      items: 'arm64'
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      name: values.project_name.trim(),
      description: values.project_description?.trim(),
      type: 'lambda',
      workspace_id: workspaceId as string,
      bucket_name: values.bucket_name.trim(),
      region: values.region,
      environment: values.environment
    })
  }

  const { isValid } = form.formState

  return (
    <FormPageContainer>
      <TitleHeader title='Create Lambda Function' showBackBtn />

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
                <FormLabel>Project description (optional)</FormLabel>
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
                <FormLabel>Function name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter function name' {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription className='text-sm font-light'>
                  Function name must be 1 to 64 characters, must be unique to the Region, and can’t include spaces.
                  Valid characters are a-z, A-Z, 0-9, hyphens (-), and underscores (_).
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='region'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Runtime</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={'nodejs18.x'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a runtime' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AWS_LAMBDA_RUNTIMES.map((runtime) => (
                      <SelectGroup>
                        <SelectLabel>{runtime.language}</SelectLabel>
                        {runtime.versions.map((version) => (
                          <SelectItem className='pl-4' value={version.runtime}>
                            {version.description}
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
            name='items'
            render={() => (
              <FormItem>
                <div className='mb-4'>
                  <FormLabel className='text-base'>Architecture</FormLabel>
                  <FormDescription>
                    Choose the instruction set architecture you want for your function code.
                  </FormDescription>
                </div>
                {items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name='items'
                    render={({ field }) => {
                      return (
                        <FormItem key={item.id} className='flex flex-row items-start space-x-3 space-y-0'>
                          <FormControl>
                            <Checkbox
                              checked={field.value === item.id}
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? item.id : field.value) // Only one item can be selected
                              }}
                            />
                          </FormControl>
                          <FormLabel className='text-sm font-normal'>{item.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}

                <FormMessage />
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
