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
  username: z.string().min(1, '请输入用户名').min(3, '用户名至少 3 个字符'),
  password: z.string().min(1, '请输入密码').min(6, '密码至少 6 个字符'),
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
      if (!response?.data) {
        throw new Error('登录失败，请稍后重试')
      }

      const { user, token, refreshToken } = response.data
      login(user, token, refreshToken)

      toast({
        title: '登录成功',
        description: `欢迎回来，${user.fullName || user.username}`,
      })

      router.push('/admin/dashboard')
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '登录失败'
      toast({
        title: '登录失败',
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
          <p className="text-gray-600">后台管理系统</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">管理员登录</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                autoComplete="username"
                disabled={isLoading}
                {...register('username')}
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                autoComplete="current-password"
                disabled={isLoading}
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '登录中…' : '登录'}
            </Button>
          </form>

          {showDevCredentials && (
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>开发环境账号：admin</p>
              <p>开发环境密码：Admin@123</p>
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
