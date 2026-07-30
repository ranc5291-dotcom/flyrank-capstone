import React from 'react'
import Card from './Card'

type Props = {
  label: string
  value: string | number
  delta?: string
}

export default function StatCard({ label, value, delta }: Props) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">{label}</div>
          <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-gray-100">{value}</div>
        </div>
        {delta ? (
          <div className="text-sm text-green-500 font-medium">{delta}</div>
        ) : null}
      </div>
    </Card>
  )
}
