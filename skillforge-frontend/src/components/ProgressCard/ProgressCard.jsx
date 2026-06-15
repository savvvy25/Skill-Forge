import styles from './ProgressCard.module.css';

function ProgressCard({ icon: Icon, label, value, color = '#6366f1', delay = 0 }) {
  const iconBg = `${color}18`;
  const glowStyle = {
    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
  };

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.header}>
        <div
          className={styles.iconBox}
          style={{ background: iconBg, color }}
        >
          {Icon && <Icon />}
        </div>
      </div>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      <div className={styles.glowLine} style={glowStyle} />
    </div>
  );
}

export default ProgressCard;
