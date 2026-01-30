import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError(t('emailAndPasswordRequired') || 'Email and password are required')
      return
    }
    try {
      await login(email, password)
      navigate('/app/projects')
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        err?.message ||
        t('loginFailed') ||
        'Login failed'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white/80 dark:bg-night/80 p-6 space-y-4">
        <h1 className="text-2xl font-bold text-ink dark:text-white">{t('login')}</h1>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <Input type="email" placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full">{t('login')}</Button>
        <div className="text-sm text-center">
          <Link to="/register" className="text-teal">{t('register')}</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
