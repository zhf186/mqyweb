'use client'

/**
 * System Settings Page
 * 系统设置页面
 */

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { settingsApi, SystemSettings } from '@/lib/api/admin'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Partial<SystemSettings>>({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await settingsApi.getSettings()
      setSettings(response.data)
    } catch (error) {
      console.error('Failed to load settings:', error)
      toast({
        title: '加载失败',
        description: '无法加载系统设置',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await settingsApi.updateSettings(settings)
      setSettings(response.data)
      toast({
        title: '保存成功',
        description: '系统设置已更新'
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast({
        title: '保存失败',
        description: '无法保存系统设置',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
          <p className="mt-2 text-gray-600">配置系统全局设置</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '保存中...' : '保存设置'}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">基本信息</TabsTrigger>
          <TabsTrigger value="seo">SEO设置</TabsTrigger>
          <TabsTrigger value="integration">第三方集成</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">网站基本信息</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="siteName">网站名称</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName || ''}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    placeholder="漫骑游"
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">联系邮箱</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail || ''}
                    onChange={(e) => updateSetting('contactEmail', e.target.value)}
                    placeholder="contact@manqiyou.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">联系电话</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone || ''}
                    onChange={(e) => updateSetting('contactPhone', e.target.value)}
                    placeholder="+86 123 4567 8900"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">社交媒体</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="weiboUrl">微博链接</Label>
                    <Input
                      id="weiboUrl"
                      value={settings.weiboUrl || ''}
                      onChange={(e) => updateSetting('weiboUrl', e.target.value)}
                      placeholder="https://weibo.com/..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="douyinUrl">抖音链接</Label>
                    <Input
                      id="douyinUrl"
                      value={settings.douyinUrl || ''}
                      onChange={(e) => updateSetting('douyinUrl', e.target.value)}
                      placeholder="https://douyin.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">SEO设置</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="seoTitle">默认标题</Label>
                <Input
                  id="seoTitle"
                  value={settings.seoTitle || ''}
                  onChange={(e) => updateSetting('seoTitle', e.target.value)}
                  placeholder="漫骑游 - 骑遇无限美好人生"
                />
                <p className="mt-1 text-sm text-gray-500">
                  建议长度：50-60个字符
                </p>
              </div>

              <div>
                <Label htmlFor="seoDescription">默认描述</Label>
                <Textarea
                  id="seoDescription"
                  value={settings.seoDescription || ''}
                  onChange={(e) => updateSetting('seoDescription', e.target.value)}
                  placeholder="漫骑游是一个高端跨境骑游旅行平台..."
                  rows={4}
                />
                <p className="mt-1 text-sm text-gray-500">
                  建议长度：150-160个字符
                </p>
              </div>

              <div>
                <Label htmlFor="seoKeywords">关键词</Label>
                <Input
                  id="seoKeywords"
                  value={settings.seoKeywords || ''}
                  onChange={(e) => updateSetting('seoKeywords', e.target.value)}
                  placeholder="骑游, E-BIKE, 电动自行车, 旅行"
                />
                <p className="mt-1 text-sm text-gray-500">
                  多个关键词用逗号分隔
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integration">
          <div className="space-y-6">
            {/* OSS Settings */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">阿里云OSS配置</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="ossAccessKeyId">Access Key ID</Label>
                    <Input
                      id="ossAccessKeyId"
                      type="password"
                      value={settings.ossAccessKeyId || ''}
                      onChange={(e) => updateSetting('ossAccessKeyId', e.target.value)}
                      placeholder="••••••••••••••••"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ossAccessKeySecret">Access Key Secret</Label>
                    <Input
                      id="ossAccessKeySecret"
                      type="password"
                      value={settings.ossAccessKeySecret || ''}
                      onChange={(e) => updateSetting('ossAccessKeySecret', e.target.value)}
                      placeholder="••••••••••••••••"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ossBucket">Bucket名称</Label>
                    <Input
                      id="ossBucket"
                      value={settings.ossBucket || ''}
                      onChange={(e) => updateSetting('ossBucket', e.target.value)}
                      placeholder="manqiyou-assets"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ossRegion">区域</Label>
                    <Input
                      id="ossRegion"
                      value={settings.ossRegion || ''}
                      onChange={(e) => updateSetting('ossRegion', e.target.value)}
                      placeholder="oss-cn-hangzhou"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* SMTP Settings */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">邮件服务配置</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="smtpHost">SMTP服务器</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost || ''}
                      onChange={(e) => updateSetting('smtpHost', e.target.value)}
                      placeholder="smtp.example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="smtpPort">端口</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.smtpPort || ''}
                      onChange={(e) => updateSetting('smtpPort', parseInt(e.target.value))}
                      placeholder="587"
                    />
                  </div>

                  <div>
                    <Label htmlFor="smtpUsername">用户名</Label>
                    <Input
                      id="smtpUsername"
                      value={settings.smtpUsername || ''}
                      onChange={(e) => updateSetting('smtpUsername', e.target.value)}
                      placeholder="noreply@manqiyou.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="smtpPassword">密码</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.smtpPassword || ''}
                      onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                      placeholder="••••••••••••••••"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Translation API */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">翻译API配置</h2>
              <div>
                <Label htmlFor="translationApiKey">API Key</Label>
                <Input
                  id="translationApiKey"
                  type="password"
                  value={settings.translationApiKey || ''}
                  onChange={(e) => updateSetting('translationApiKey', e.target.value)}
                  placeholder="••••••••••••••••"
                />
                <p className="mt-1 text-sm text-gray-500">
                  用于一键生成英文翻译建议
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
