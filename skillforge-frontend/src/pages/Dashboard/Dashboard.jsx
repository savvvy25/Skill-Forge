import {
  RiCodeBoxLine,
  RiCheckDoubleLine,
  RiFlashlightLine,
  RiFireLine,
  RiStackLine,
  RiPercentLine,
  RiBarChartBoxLine,
  RiAlertLine,
} from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../hooks/useDashboard';
import { useProgress } from '../../hooks/useProgress';
import { getGreeting, calculatePercentage } from '../../utils/helpers';
import ProgressCard from '../../components/ProgressCard/ProgressCard';
import TopicBarChart from '../../components/AnalyticsCharts/TopicBarChart';
import DifficultyPieChart from '../../components/AnalyticsCharts/DifficultyPieChart';
import WeeklyLineChart from '../../components/AnalyticsCharts/WeeklyLineChart';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { user } = useAuth();
  const { summary, loading: summaryLoading, error: summaryError, refetch } = useDashboard();
  const { progress, loading: progressLoading } = useProgress();

  const loading = summaryLoading || progressLoading;

  // Calculate stats from progress data
  const totalEasy = progress.reduce(
    (acc, item) => acc + (item.easyCount || 0),
    0
  );
  const totalMedium = progress.reduce(
    (acc, item) => acc + (item.mediumCount || 0),
    0
  );
  const totalHard = progress.reduce(
    (acc, item) => acc + (item.hardCount || 0),
    0
  );
  const totalSolved = totalEasy + totalMedium + totalHard;
  const topicsCovered = progress.length;

  // Use summary if available, otherwise fall back to computed
  const statsData = {
    totalSolved: summary?.totalSolved ?? totalSolved,
    easySolved: summary?.easySolved ?? totalEasy,
    mediumSolved: summary?.mediumSolved ?? totalMedium,
    hardSolved: summary?.hardSolved ?? totalHard,
    topicsCovered: summary?.topicsCovered ?? topicsCovered,
    completionPercentage: summary?.completionPercentage ?? calculatePercentage(topicsCovered, 17),
  };

  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'there';

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className="skeleton skeleton-title" style={{ width: '300px' }} />
          <div className="skeleton skeleton-text" style={{ width: '200px' }} />
        </div>
        <div className={styles.skeletonGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
        <div className={styles.skeletonChart} />
      </div>
    );
  }

  if (summaryError) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.greeting}>
            {greeting}, <span className={styles.greetingName}>{firstName}</span>
          </h1>
        </div>
        <div className={styles.errorState}>
          <RiAlertLine className={styles.errorIcon} />
          <p className={styles.errorText}>
            Failed to load dashboard data
          </p>
          <button className={styles.retryBtn} onClick={refetch}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.greeting}>
          {greeting}, <span className={styles.greetingName}>{firstName}</span> 👋
        </h1>
        <p className={styles.subgreeting}>
          Here&apos;s your DSA progress overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <ProgressCard
          icon={RiCodeBoxLine}
          label="Total Solved"
          value={statsData.totalSolved}
          color="#3b82f6"
          delay={0}
        />
        <ProgressCard
          icon={RiCheckDoubleLine}
          label="Easy Solved"
          value={statsData.easySolved}
          color="#10b981"
          delay={80}
        />
        <ProgressCard
          icon={RiFlashlightLine}
          label="Medium Solved"
          value={statsData.mediumSolved}
          color="#f59e0b"
          delay={160}
        />
        <ProgressCard
          icon={RiFireLine}
          label="Hard Solved"
          value={statsData.hardSolved}
          color="#ef4444"
          delay={240}
        />
        <ProgressCard
          icon={RiStackLine}
          label="Topics Covered"
          value={statsData.topicsCovered}
          color="#8b5cf6"
          delay={320}
        />
        <ProgressCard
          icon={RiPercentLine}
          label="Completion"
          value={`${statsData.completionPercentage}%`}
          color="#06b6d4"
          delay={400}
        />
      </div>

      {/* Analytics */}
      <div className={styles.analyticsSection}>
        <h2 className={styles.sectionTitle}>
          <RiBarChartBoxLine className={styles.sectionIcon} />
          Analytics
        </h2>

        <div className={styles.chartsGrid}>
          {/* Topic Bar Chart - Full Width */}
          <div
            className={styles.chartCard}
            style={{ animationDelay: '200ms' }}
          >
            <h3 className={styles.chartTitle}>Questions by Topic</h3>
            <TopicBarChart data={progress} />
          </div>

          {/* Pie + Line Charts - Side by Side */}
          <div className={styles.chartRow}>
            <div
              className={styles.chartCard}
              style={{ animationDelay: '300ms' }}
            >
              <h3 className={styles.chartTitle}>Difficulty Distribution</h3>
              <DifficultyPieChart
                easy={statsData.easySolved}
                medium={statsData.mediumSolved}
                hard={statsData.hardSolved}
              />
            </div>
            <div
              className={styles.chartCard}
              style={{ animationDelay: '400ms' }}
            >
              <h3 className={styles.chartTitle}>Weekly Progress</h3>
              <WeeklyLineChart progressData={progress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
