import { FormPageContainer } from '@/components/shared/FormPageContainer'
import LoadingButton from '@/components/shared/LoadingButton'
import TitleHeader from '@/components/shared/TitleHeader'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateWorkspace } from '@/services/useCreateWorkspace'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const CreateWorkspace = () => {
  const formSchema = z.object({
    workspace_name: z.string().min(2, {
      message: 'Workspace name must be at least 2 characters.'
    }),
    workspace_description: z.string().optional(),
    workspace_access_key: z
      .string()
      .min(20, {
        message: 'Access key must be length of 20.'
      })
      .max(20),
    workspace_secret_key: z
      .string()
      .min(40, {
        message: 'Secret access key must be length of 40.'
      })
      .max(40),
    agree: z
      .boolean({
        message: 'Please agree to the Terms and Conditions.'
      })
      .refine((val) => val === true, {
        message: 'You must agree to proceed.'
      })
  })

  const { mutate, isPending } = useCreateWorkspace()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspace_name: '',
      workspace_description: '',
      workspace_access_key: '',
      workspace_secret_key: '',
      agree: false // Default agree to false
    },
    mode: 'onChange' // Validates form on each change
  })

  const { isValid } = form.formState

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      name: values.workspace_name,
      description: values.workspace_description,
      created_by: '123',
      company_name: values.workspace_name,
      access_key: values.workspace_access_key,
      secret_key: values.workspace_secret_key
    })
  }

  return (
    <FormPageContainer>
      <TitleHeader title='Create Workspace' showBackBtn />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='workspace_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace name</FormLabel>
                <FormControl>
                  <Input placeholder='Example: Your company name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='workspace_description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace description (optional)</FormLabel>
                <FormControl>
                  <Input placeholder='Your workspace description' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='workspace_access_key'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Key</FormLabel>
                <FormControl>
                  <Input placeholder='Your AWS Access Key' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='workspace_secret_key'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret Access Key</FormLabel>
                <FormControl>
                  <Input placeholder='Your AWS Secret Access Key' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='agree'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow'>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>I agree to securely share my credentials.</FormLabel>
                  <FormDescription>
                    Your credentials will be protected with the utmost security measures.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <LoadingButton className='w-full' type='submit' disabled={!isValid} isLoading={isPending}>
            Create Workspace
          </LoadingButton>
        </form>
      </Form>
    </FormPageContainer>
  )
}

export default CreateWorkspace
