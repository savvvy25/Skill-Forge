import { useLocation } from 'react-router-dom';
import { RiMenuLine, RiSearchLine, RiLogoutBoxRLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import styles from './Navbar.module.css';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/progress': 'Progress Tracker',
  '/profile': 'Profile',
};

function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || 'SkillForge';
  const initials = getInitials(user?.name);

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button
          className={styles.hamburger}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <RiMenuLine />
        </button>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
      </div>

      <div className={styles.searchWrapper}>
        <RiSearchLine className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search topics, problems..."
          readOnly
        />
      </div>

      <div className={styles.right}>
        <div className={styles.avatar} title={user?.name}>
          {initials}
        </div>
        <span className={styles.userName}>{user?.name}</span>
        <button className={styles.logoutBtn} onClick={logout}>
          <RiLogoutBoxRLine className={styles.logoutIcon} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
