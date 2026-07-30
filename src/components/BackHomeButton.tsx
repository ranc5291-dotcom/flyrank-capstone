import { useNavigate } from 'react-router-dom'

export default function BackHomeButton() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/')}
      className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 mb-4"
    >
      ← Back to Home
    </button>
  )
}