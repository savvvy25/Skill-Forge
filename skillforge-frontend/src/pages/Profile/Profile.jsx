import { useState, useEffect } from 'react';
import { RiEditLine, RiSaveLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';
import { getInitials, formatDate } from '../../utils/helpers';
import { BRANCH_OPTIONS, GRADUATION_YEARS } from '../../utils/constants';
import styles from './Profile.module.css';

function Profile() {
  const { user, loading: authLoading, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    graduationYear: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        branch: user.branch || '',
        graduationYear: user.graduationYear || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setFormData({
        name: user.name || '',
        branch: user.branch || '',
        graduationYear: user.graduationYear || '',
      });
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required', {
        style: { background: '#1a1f35', color: '#f1f5f9', border: '1px solid rgba(239,68,68,0.3)' },
        iconTheme: { primary: '#ef4444', secondary: '#1a1f35' },
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        graduationYear: formData.graduationYear
          ? parseInt(formData.graduationYear, 10)
          : undefined,
      };
      const response = await updateProfile(payload);
      // Extract from ApiResponse wrapper: { success, message, data: UserDTO }
      const updatedData = response.data?.data || response.data;
      updateUser(updatedData);
      setEditing(false);
      toast.success('Profile updated successfully!', {
        style: { background: '#1a1f35', color: '#f1f5f9', border: '1px solid rgba(16,185,129,0.3)' },
        iconTheme: { primary: '#10b981', secondary: '#1a1f35' },
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      toast.error(message, {
        style: { background: '#1a1f35', color: '#f1f5f9', border: '1px solid rgba(239,68,68,0.3)' },
        iconTheme: { primary: '#ef4444', secondary: '#1a1f35' },
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Profile</h1>
        </div>
        <div className={styles.skeleton} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
      </div>

      <div className={styles.profileCard}>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{getInitials(user?.name)}</div>
            <div>
              <h2 className={styles.userName}>{user?.name || 'User'}</h2>
              <p className={styles.userEmail}>{user?.email || ''}</p>
            </div>
          </div>
          {!editing && (
            <button className={styles.editBtn} onClick={handleEdit}>
              <RiEditLine />
              Edit Profile
            </button>
          )}
        </div>

        {/* Card Body */}
        <div className={styles.cardBody}>
          <div className={styles.fieldGroup}>
            {/* Name */}
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Full Name</span>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  className={styles.fieldInput}
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <span className={styles.fieldValue}>{user?.name || '—'}</span>
              )}
            </div>

            {/* Email */}
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Email</span>
              {editing ? (
                <input
                  type="email"
                  className={styles.fieldInput}
                  value={user?.email || ''}
                  disabled
                  title="Email cannot be changed"
                />
              ) : (
                <span className={styles.fieldValue}>{user?.email || '—'}</span>
              )}
            </div>

            {/* Branch */}
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Branch</span>
              {editing ? (
                <select
                  name="branch"
                  className={styles.fieldSelect}
                  value={formData.branch}
                  onChange={handleChange}
                >
                  <option value="">Select branch</option>
                  {BRANCH_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              ) : (
                <span className={styles.fieldValue}>{user?.branch || '—'}</span>
              )}
            </div>

            {/* Graduation Year */}
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Graduation Year</span>
              {editing ? (
                <select
                  name="graduationYear"
                  className={styles.fieldSelect}
                  value={formData.graduationYear}
                  onChange={handleChange}
                >
                  <option value="">Select year</option>
                  {GRADUATION_YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              ) : (
                <span className={styles.fieldValue}>
                  {user?.graduationYear || '—'}
                </span>
              )}
            </div>

            {/* Member Since */}
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <span className={styles.fieldLabel}>Member Since</span>
              <span className={styles.fieldValue}>
                {formatDate(user?.createdAt) || '—'}
              </span>
            </div>
          </div>

          {/* Actions */}
          {editing && (
            <div className={styles.actions}>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={saving}
              >
                <RiSaveLine />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
