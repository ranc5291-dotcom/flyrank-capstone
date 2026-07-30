import React from 'react'

type Props = {
  title?: string
  children: React.ReactNode
  className?: string
}

export default function Card({ title, children, className = '' }: Props) {
  return (
    <div className={`bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 ${className}`}>
      {title ? <div className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-300">{title}</div> : null}
      <div>{children}</div>
    </div>
  )
}
