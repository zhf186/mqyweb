'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAdminAuthStore } from '@/stores/admin-auth'
import { authApi } from '@/lib/api/admin'

const loginSchema = z.object({
  username: z.string().min(1, 'Please enter username').min(3, 'Username must be at least 3 characters'),
  password: z.string().min(1, 'Please enter password').min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const login = useAdminAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)
  const showDevCredentials = process.env.NEXT_PUBLIC_SHOW_DEV_CREDENTIALS === 'true'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(data)
      const { user, token } = response.data
      login(user, token)

      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.fullName || user.username}`,
      })

      router.push('/admin/dashboard')
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed'
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manqiyou CMS</h1>
          <p className="text-gray-600">Admin management system</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Admin Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                autoComplete="username"
                disabled={isLoading}
                {...register('username')}
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={isLoading}
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {showDevCredentials && (
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>dev admin user: admin</p>
              <p>dev admin password: Admin@123</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Copyright 2026 Manqiyou. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
