import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import './Dashboard.css';

export default function Dashboard() {
  const { user, userRole } = useAuth();

  const stats = [
    { label: 'Total Requests', value: '24', color: 'primary' },
    { label: 'Active Volunteers', value: '12', color: 'secondary' },
    { label: 'Completed', value: '18', color: 'success' },
    { label: 'Pending', value: '6', color: 'warning' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <Badge variant="primary" size="lg">
          {userRole}
        </Badge>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <Card key={stat.label} className={`stat-card stat-${stat.color}`}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Card className="dashboard-card">
        <h2>Quick Overview</h2>
        <p>Welcome to Carebridge! Here you can manage community requests and volunteer opportunities.</p>
        <p>
          {userRole === 'USER'
            ? 'Create new requests for help or browse available volunteer services.'
            : 'Browse community requests and help those in need.'}
        </p>
      </Card>
    </div>
  );
}
