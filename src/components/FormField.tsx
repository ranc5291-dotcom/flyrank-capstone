import React, { forwardRef } from 'react'

const baseClass = 'w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none'

type As = 'input' | 'select' | 'textarea'

type Props = {
  as?: As
  className?: string
  children?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement> & React.SelectHTMLAttributes<HTMLSelectElement>

// Forward ref so react-hook-form register refs and parent refs work.
const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  Props
>(({ as = 'input', className = '', children, ...rest }, ref) => {
  const classes = `${baseClass} ${className}`.trim()

  // Some callers (react-hook-form) spread a `ref` into props. Grab and remove it
  // so we can combine it with the forwarded ref.
  const providedRef = (rest as any).ref
  if ((rest as any).ref) delete (rest as any).ref

  // Combined ref calls both forwarded ref and register ref.
  const combinedRef = (el: any) => {
    if (typeof ref === 'function') ref(el)
    else if (ref && typeof (ref as any) === 'object') (ref as any).current = el

    if (typeof providedRef === 'function') providedRef(el)
    else if (providedRef && typeof providedRef === 'object') providedRef.current = el
  }

  if (as === 'textarea') {
    return (
      <textarea ref={combinedRef as any} className={classes} {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}>
        {children}
      </textarea>
    )
  }

  if (as === 'select') {
    return (
      <select ref={combinedRef as any} className={classes} {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}>
        {children}
      </select>
    )
  }

  return <input ref={combinedRef as any} className={classes} {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />
})

export default FormField
