import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiFlashlightFill, RiMailLine, RiLockLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!', {
        style: {
          background: '#1a1f35',
          color: '#f1f5f9',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        },
        iconTheme: { primary: '#10b981', secondary: '#1a1f35' },
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setApiError(message);
      toast.error(message, {
        style: {
          background: '#1a1f35',
          color: '#f1f5f9',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
        iconTheme: { primary: '#ef4444', secondary: '#1a1f35' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Animated Background Orbs */}
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div className={styles.card}>
        {/* Branding */}
        <div className={styles.branding}>
          <div className={styles.logoIcon}>
            <RiFlashlightFill />
          </div>
          <h1 className={styles.title}>SkillForge</h1>
          <p className={styles.subtitle}>Sign in to track your DSA progress</p>
        </div>

        {/* API Error */}
        {apiError && <div className={styles.errorMessage}>{apiError}</div>}

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <RiMailLine className={styles.inputIcon} />
            </div>
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                name="password"
                type="password"
                className={styles.input}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <RiLockLine className={styles.inputIcon} />
            </div>
            {errors.password && (
              <span className={styles.fieldError}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            <span className={styles.btnContent}>
              {loading && <span className={styles.btnSpinner} />}
              {loading ? 'Signing in…' : 'Sign In'}
            </span>
          </button>
        </form>

        <p className={styles.footerText}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className={styles.footerLink}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
