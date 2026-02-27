'use client'

import { Card } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Update {
  id: string
  type: 'content' | 'asset' | 'route' | 'product'
  title: string
  action: string
  user: string
  timestamp: string
}

interface RecentUpdatesProps {
  updates: Update[]
}

const typeIcons: Record<Update['type'], JSX.Element> = {
  content: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  asset: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  route: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  ),
  product: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  ),
}

const typeColors: Record<Update['type'], string> = {
  content: 'bg-blue-100 text-blue-600',
  asset: 'bg-green-100 text-green-600',
  route: 'bg-purple-100 text-purple-600',
  product: 'bg-orange-100 text-orange-600',
}

const safeDate = (value: string) => {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

export function RecentUpdates({ updates }: RecentUpdatesProps) {
  const safeUpdates = Array.isArray(updates) ? updates : []

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Updates</h2>
      {safeUpdates.length === 0 ? (
        <p className="py-8 text-center text-gray-500">No update records</p>
      ) : (
        <div className="space-y-4">
          {safeUpdates.map((update) => (
            <div key={update.id} className="flex items-start space-x-3">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${typeColors[update.type]}`}
              >
                {typeIcons[update.type]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{update.title}</p>
                <p className="text-sm text-gray-500">
                  {update.action} - {update.user}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {formatDistanceToNow(safeDate(update.timestamp), {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
