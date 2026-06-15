import { NavLink } from 'react-router-dom';
import { RiDashboardLine, RiCodeLine, RiUserLine, RiFlashlightFill } from 'react-icons/ri';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: RiDashboardLine },
  { to: '/progress', label: 'Progress Tracker', icon: RiCodeLine },
  { to: '/profile', label: 'Profile', icon: RiUserLine },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <NavLink to="/dashboard" className={styles.logoLink} onClick={onClose}>
            <div className={styles.logoIcon}>
              <RiFlashlightFill />
            </div>
            <div>
              <div className={styles.logoText}>SkillForge</div>
              <div className={styles.logoSubtext}>DSA Tracker</div>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navLabel}>Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <item.icon className={styles.navIcon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.version}>SkillForge v1.0.0</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
