import { Badge } from '../ui/Badge';
import './RequestStatus.css';

export const RequestStatus = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      PENDING: { variant: 'warning', label: 'Pending' },
      ACCEPTED: { variant: 'info', label: 'Accepted' },
      IN_PROGRESS: { variant: 'primary', label: 'In Progress' },
      COMPLETED: { variant: 'success', label: 'Completed' },
      CANCELLED: { variant: 'danger', label: 'Cancelled' },
    };
    return configs[status] || { variant: 'primary', label: status };
  };

  const config = getStatusConfig(status);

  return (
    <div className="request-status">
      <Badge variant={config.variant} size="lg">
        {config.label}
      </Badge>
    </div>
  );
};
