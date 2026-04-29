import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import './AdminDashboard.css';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-stats-grid">
        <Card className="admin-stat">
          <h3>Total Users</h3>
          <div className="admin-stat-value">128</div>
        </Card>

        <Card className="admin-stat">
          <h3>Total Requests</h3>
          <div className="admin-stat-value">245</div>
        </Card>

        <Card className="admin-stat">
          <h3>Active Volunteers</h3>
          <div className="admin-stat-value">89</div>
        </Card>

        <Card className="admin-stat">
          <h3>Completion Rate</h3>
          <div className="admin-stat-value">92%</div>
        </Card>
      </div>

      <Card className="admin-panel">
        <h2>System Status</h2>
        <div className="status-list">
          <div className="status-item">
            <span>API Server</span>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="status-item">
            <span>Database</span>
            <Badge variant="success">Connected</Badge>
          </div>
          <div className="status-item">
            <span>Email Service</span>
            <Badge variant="success">Operational</Badge>
          </div>
        </div>
      </Card>

      <Card className="admin-panel">
        <h2>Recent Activities</h2>
        <p className="text-muted">No recent activities</p>
      </Card>
    </div>
  );
}
