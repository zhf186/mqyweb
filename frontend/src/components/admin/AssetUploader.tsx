'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { assetApi } from '@/lib/api/admin'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AssetUploaderProps {
  category: string
  onUploadComplete: (uploadedCategory: string) => void
  onClose: () => void
  maxFiles?: number
  maxSize?: number // MB
}

interface UploadFile {
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

const CATEGORIES = [
  { value: 'home', label: '首页' },
  { value: 'about', label: '关于我们' },
  { value: 'ebike', label: 'E-BIKE页面' },
  { value: 'routes', label: '骑行路线' },
  { value: 'goods', label: '在地好物' },
  { value: 'community', label: '社群活动' },
  { value: 'partners', label: '合作伙伴' },
  { value: 'products', label: '商品' },
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']

export default function AssetUploader({
  category: initialCategory,
  onUploadComplete,
  onClose,
  maxFiles = 20,
  maxSize = 5,
}: AssetUploaderProps) {
  const [category, setCategory] = useState(initialCategory)
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    console.log('Accepted files:', acceptedFiles)
    console.log('Rejected files:', rejectedFiles)

    // Validate files
    const validFiles: UploadFile[] = []
    const errors: string[] = []

    acceptedFiles.forEach(file => {
      // Check format
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        errors.push(`${file.name}: 不支持的文件格式`)
        return
      }
      // Check size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: 文件大小超过 ${maxSize}MB`)
        return
      }

      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
        progress: 0,
      })
    })

    // Show errors if any
    if (errors.length > 0) {
      alert(errors.join('\n'))
    }

    // Check max files
    if (files.length + validFiles.length > maxFiles) {
      alert(`最多只能上传 ${maxFiles} 张图片`)
      return
    }

    // Add files
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
    }
  }, [files.length, maxFiles, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: true,
    onDropRejected: (fileRejections) => {
      console.log('Rejected files:', fileRejections)
      const errors = fileRejections.map(rejection => {
        const errors = rejection.errors.map(e => e.message).join(', ')
        return `${rejection.file.name}: ${errors}`
      })
      if (errors.length > 0) {
        alert('文件被拒绝:\n' + errors.join('\n'))
      }
    },
  })

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)

    try {
      // Update all files to uploading
      setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const })))

      // Upload files
      const filesToUpload = files.map(f => f.file)
      await assetApi.uploadAssets(filesToUpload, category)

      // Update all files to success
      setFiles(prev => prev.map(f => ({ ...f, status: 'success' as const, progress: 100 })))

      // Wait a bit to show success state
      setTimeout(() => {
        onUploadComplete(category)
      }, 1000)
    } catch (error: any) {
      // Update all files to error
      setFiles(prev => prev.map(f => ({
        ...f,
        status: 'error' as const,
        error: error.message || '上传失败',
      })))
    } finally {
      setIsUploading(false)
    }
  }

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return '不支持的文件格式，请上传 JPG、PNG 或 WebP 格式'
    }
    if (file.size > MAX_FILE_SIZE) {
      return `文件大小超过 ${maxSize}MB 限制`
    }
    return null
  }

  const hasErrors = files.some(f => f.status === 'error')
  const allSuccess = files.length > 0 && files.every(f => f.status === 'success')

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>上传图片</DialogTitle>
          <DialogDescription>
            支持 JPG、PNG、WebP 格式，单张图片不超过 {maxSize}MB，最多上传 {maxFiles} 张
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">图片分类</label>
            <Select value={category} onValueChange={setCategory} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropzone */}
          {!isUploading && !allSuccess && (
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              )}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg font-medium">放开以上传图片</p>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">拖拽图片到这里，或点击选择</p>
                  <p className="text-sm text-muted-foreground">
                    支持批量上传，最多 {maxFiles} 张
                  </p>
                </>
              )}
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  已选择 {files.length} 张图片
                </h3>
                {!isUploading && !allSuccess && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiles([])}
                  >
                    清空
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg p-3 space-y-2"
                  >
                    {/* Preview */}
                    <div className="relative aspect-video bg-muted rounded overflow-hidden">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                      {file.status === 'success' && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                      )}
                      {file.status === 'error' && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    {/* Progress */}
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="h-1" />
                    )}

                    {/* Error */}
                    {file.status === 'error' && file.error && (
                      <p className="text-xs text-red-500">{file.error}</p>
                    )}

                    {/* Remove Button */}
                    {!isUploading && file.status !== 'success' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              {allSuccess ? '关闭' : '取消'}
            </Button>
            {!allSuccess && (
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    上传中...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    开始上传
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
