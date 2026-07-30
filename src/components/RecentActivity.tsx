import React from 'react'
import type { Activity } from '../types/dashboard'

type Props = {
  activity: Activity[]
}

function iconFor(type: string) {
  switch (type) {
    case 'create':
      return '✚'
    case 'edit':
      return '✎'
    case 'favorite':
      return '★'
    case 'delete':
      return '✕'
    default:
      return '•'
  }
}

export default function RecentActivity({ activity }: Props) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">Recent activity</div>
      <div className="space-y-2">
        {activity.map((a) => (
          <div key={a.id} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm">{iconFor(a.type)}</div>
            <div>
              <div className="text-sm">
                <span className="font-medium">{a.user}</span> {a.type} <span className="font-medium">{a.title}</span>
              </div>
              <div className="text-xs text-gray-500">{new Date(a.at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
