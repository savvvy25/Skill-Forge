import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: 'rgba(26, 31, 53, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '14px 18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <p
        style={{
          color: '#f1f5f9',
          fontWeight: 600,
          fontSize: '14px',
          marginBottom: '8px',
        }}
      >
        {label}
      </p>
      {payload.map((entry, index) => (
        <p
          key={index}
          style={{
            color: entry.color,
            fontSize: '13px',
            margin: '4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: entry.color,
              display: 'inline-block',
            }}
          />
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
};

function TopicBarChart({ data = [] }) {
  const chartData = data.map((item) => ({
    topic: item.topic?.length > 12 ? item.topic.substring(0, 12) + '…' : item.topic,
    fullTopic: item.topic,
    Easy: item.easyCount || 0,
    Medium: item.mediumCount || 0,
    Hard: item.hardCount || 0,
  }));

  if (chartData.length === 0) {
    return (
      <div
        style={{
          height: 350,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontSize: '14px',
        }}
      >
        No topic data available yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
        barCategoryGap="20%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />
        <XAxis
          dataKey="topic"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
          angle={-35}
          textAnchor="end"
          height={60}
          interval={0}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend
          wrapperStyle={{ paddingTop: 10, fontSize: 13, color: '#94a3b8' }}
          iconType="circle"
          iconSize={8}
        />
        <Bar dataKey="Easy" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Medium" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Hard" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TopicBarChart;
