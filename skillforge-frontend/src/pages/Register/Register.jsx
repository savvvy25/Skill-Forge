import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiFlashlightFill,
  RiUserLine,
  RiMailLine,
  RiLockLine,
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { BRANCH_OPTIONS, GRADUATION_YEARS } from '../../utils/constants';
import styles from './Register.module.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    graduationYear: '',
  });
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
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.branch) {
      newErrors.branch = 'Please select a branch';
    }
    if (!formData.graduationYear) {
      newErrors.graduationYear = 'Please select graduation year';
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
      await register({
        ...formData,
        graduationYear: parseInt(formData.graduationYear, 10),
      });
      toast.success('Account created! Please sign in.', {
        style: {
          background: '#1a1f35',
          color: '#f1f5f9',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        },
        iconTheme: { primary: '#10b981', secondary: '#1a1f35' },
      });
      navigate('/login', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
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
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            Join SkillForge and start tracking your DSA journey
          </p>
        </div>

        {/* API Error */}
        {apiError && <div className={styles.errorMessage}>{apiError}</div>}

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Full Name
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="name"
                name="name"
                type="text"
                className={styles.input}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
              <RiUserLine className={styles.inputIcon} />
            </div>
            {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
          </div>

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
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <RiLockLine className={styles.inputIcon} />
            </div>
            {errors.password && (
              <span className={styles.fieldError}>{errors.password}</span>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="branch">
                Branch
              </label>
              <select
                id="branch"
                name="branch"
                className={styles.select}
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="">Select branch</option>
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <span className={styles.fieldError}>{errors.branch}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="graduationYear">
                Graduation Year
              </label>
              <select
                id="graduationYear"
                name="graduationYear"
                className={styles.select}
                value={formData.graduationYear}
                onChange={handleChange}
              >
                <option value="">Select year</option>
                {GRADUATION_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {errors.graduationYear && (
                <span className={styles.fieldError}>{errors.graduationYear}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            <span className={styles.btnContent}>
              {loading && <span className={styles.btnSpinner} />}
              {loading ? 'Creating Account…' : 'Create Account'}
            </span>
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
