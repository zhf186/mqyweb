'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface TodoItem {
  id: string
  title: string
  description: string
  count: number
  priority: 'high' | 'medium' | 'low'
  link: string
}

interface TodoListProps {
  items: TodoItem[]
}

const priorityColors: Record<TodoItem['priority'], string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-gray-100 text-gray-800',
}

const priorityLabels: Record<TodoItem['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export function TodoList({ items }: TodoListProps) {
  const safeItems = Array.isArray(items) ? items : []

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">To-do Items</h2>
      {safeItems.length === 0 ? (
        <div className="py-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-2 text-gray-500">No pending items</p>
        </div>
      ) : (
        <div className="space-y-3">
          {safeItems.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="block rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                    <Badge className={priorityColors[item.priority]}>
                      {priorityLabels[item.priority]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                    {item.count}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  )
}
