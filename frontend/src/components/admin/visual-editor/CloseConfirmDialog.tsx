'use client'

/**
 * Close Confirmation Dialog
 * 关闭确认对话框
 * 
 * Warns users about unsaved changes before closing the editor
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface CloseConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  hasUnsavedChanges: boolean
}

export function CloseConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  hasUnsavedChanges,
}: CloseConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasUnsavedChanges ? '确认关闭？' : '关闭编辑器'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasUnsavedChanges
              ? '您有未保存的修改，关闭后这些修改将会丢失。确定要关闭吗？'
              : '确定要关闭可视化编辑器并返回内容管理页面吗？'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {hasUnsavedChanges ? '放弃修改并关闭' : '确认关闭'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
