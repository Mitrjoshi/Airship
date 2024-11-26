import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import LoadingButton from '@/components/shared/LoadingButton'
import { useSignUp } from '@/services/useSignUp'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  }),
  email: z.string().email({
    message: 'Invalid email address.'
  })
})

export const SignUp = () => {
  const { mutate, isPending } = useSignUp()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    },
    mode: 'onChange'
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values)
  }

  const { isValid } = form.formState

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-3xl'>Sign up</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Email</FormLabel>
                  <FormControl>
                    <Input className='text-sm' type='email' placeholder='Email address' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Username</FormLabel>
                  <FormControl>
                    <Input className='text-sm' placeholder='Username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Password</FormLabel>
                  <FormControl>
                    <Input max={24} className='text-sm' type='password' placeholder='Password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton isLoading={isPending} disabled={!isValid} className='w-full' size='sm' type='submit'>
              Sign up
            </LoadingButton>
          </form>
        </Form>

        <p className='mt-2 text-center text-sm'>
          Already have an Account?{' '}
          <Link className='font-medium text-blue-400 underline underline-offset-2' replace to='/auth'>
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
