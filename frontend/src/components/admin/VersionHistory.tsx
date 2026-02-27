'use client'

import { useState, useEffect } from 'react'
import { contentApi, type ContentVersion } from '@/lib/api/admin'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { Clock, User, RotateCcw, Loader2, AlertCircle } from 'lucide-react'

interface VersionHistoryProps {
  contentItemId: string
  isOpen: boolean
  onClose: () => void
  onRestored: () => void
}

/**
 * 版本历史组件
 * Requirements: 6.2, 6.4, 6.5, 6.6
 */
export function VersionHistory({
  contentItemId,
  isOpen,
  onClose,
  onRestored,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<ContentVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      loadVersions()
    }
  }, [isOpen, contentItemId])

  const loadVersions = async () => {
    try {
      setLoading(true)
      const response = await contentApi.getVersions(contentItemId)
      setVersions(response.data)
    } catch (error) {
      console.error('Failed to load versions:', error)
      toast({
        title: '加载失败',
        description: '无法加载版本历史，请重试',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (versionId: string) => {
    try {
      setRestoring(versionId)
      await contentApi.restoreVersion(contentItemId, versionId)
      toast({
        title: '恢复成功',
        description: '内容已恢复到选定版本',
      })
      setShowRestoreConfirm(false)
      setSelectedVersion(null)
      onRestored()
      onClose()
    } catch (error) {
      console.error('Failed to restore version:', error)
      toast({
        title: '恢复失败',
        description: '无法恢复版本，请重试',
        variant: 'destructive',
      })
    } finally {
      setRestoring(null)
    }
  }

  const confirmRestore = (version: ContentVersion) => {
    setSelectedVersion(version)
    setShowRestoreConfirm(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>版本历史</DialogTitle>
            <DialogDescription>
              查看内容的修改历史并恢复到之前的版本
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : versions.length > 0 ? (
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <Card
                    key={version.id}
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">
                            版本 {version.versionNumber}
                          </span>
                          {index === 0 && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                              当前版本
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(version.createdAt).toLocaleString('zh-CN')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>修改人: {version.changedBy}</span>
                          </div>
                        </div>

                        {version.changeSummary && (
                          <p className="text-sm text-gray-600">
                            {version.changeSummary}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">
                              中文内容
                            </p>
                            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                              {version.contentZh || (
                                <span className="text-gray-400">未填写</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">
                              English Content
                            </p>
                            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                              {version.contentEn || (
                                <span className="text-gray-400">Not filled</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {index !== 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => confirmRestore(version)}
                          disabled={!!restoring}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          恢复
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">暂无版本历史</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认恢复版本</DialogTitle>
            <DialogDescription>
              确定要恢复到版本 {selectedVersion?.versionNumber} 吗？
            </DialogDescription>
          </DialogHeader>

          {selectedVersion && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  恢复操作将创建一个新版本，当前内容不会丢失
                </p>
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">版本信息:</p>
                <p>修改时间: {new Date(selectedVersion.createdAt).toLocaleString('zh-CN')}</p>
                <p>修改人: {selectedVersion.changedBy}</p>
                {selectedVersion.changeSummary && (
                  <p>修改摘要: {selectedVersion.changeSummary}</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRestoreConfirm(false)
                setSelectedVersion(null)
              }}
              disabled={!!restoring}
            >
              取消
            </Button>
            <Button
              onClick={() => selectedVersion && handleRestore(selectedVersion.id)}
              disabled={!!restoring}
            >
              {restoring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认恢复
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
