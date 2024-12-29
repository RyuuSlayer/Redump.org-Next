import { Metadata } from 'next'
import LoginForm from '@/components/LoginForm'

export const metadata: Metadata = {
  title: 'Login - Redump Database',
  description: 'Login to access additional features',
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <LoginForm />
    </div>
  )
}
