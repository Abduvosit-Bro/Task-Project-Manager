import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const { t } = useTranslation()
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', display_name: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.email.trim() || !form.password.trim()) {
      setError(t('emailAndPasswordRequired') || 'Email and password are required')
      return
    }
    if (form.password.length < 8) {
      setError(t('passwordMinLength') || 'Password must be at least 8 characters')
      return
    }
    try {
      await register(form)
      navigate('/login')
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        Object.values(err?.response?.data || {})
          .flat()
          .join(' ') ||
        err?.message ||
        t('registrationFailed') ||
        'Registration failed'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white/80 dark:bg-night/80 p-6 space-y-4">
        <h1 className="text-2xl font-bold text-ink dark:text-white">{t('register')}</h1>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <Input type="email" placeholder={t('email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input placeholder={t('displayName')} value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
        <Input type="password" placeholder={t('password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" className="w-full">{t('register')}</Button>
        <div className="text-sm text-center">
          <Link to="/login" className="text-teal">{t('login')}</Link>
        </div>
      </form>
    </div>
  )
}

export default Register
