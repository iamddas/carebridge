import { FiX, FiRadio, FiAlertOctagon } from 'react-icons/fi';
import { useWebSocket } from '../context/WebSocketContext';
import './globalAlerts.css';

export default function GlobalAlerts() {
    const { broadcasts, emergencies, dismissBroadcast, dismissEmergency } = useWebSocket();

    if (!broadcasts.length && !emergencies.length) return null;

    return (
        <div className="ga-container">
            {emergencies.map((e) => (
                <div key={e.id} className="ga-card ga-emergency">
                    <div className="ga-icon"><FiAlertOctagon /></div>
                    <div className="ga-body">
                        <div className="ga-title">EMERGENCY — {e.title}</div>
                        <div className="ga-message">{e.description}</div>
                        {(e.priority || e.location) && (
                            <div className="ga-meta">
                                {e.priority && <span className="ga-tag">{e.priority}</span>}
                                {e.location && <span>{e.location}</span>}
                            </div>
                        )}
                    </div>
                    <button className="ga-close" onClick={() => dismissEmergency(e.id)} title="Dismiss">
                        <FiX />
                    </button>
                </div>
            ))}

            {broadcasts.map((b) => (
                <div key={b.id} className="ga-card ga-broadcast">
                    <div className="ga-icon"><FiRadio /></div>
                    <div className="ga-body">
                        <div className="ga-title">{b.title}</div>
                        <div className="ga-message">{b.message}</div>
                    </div>
                    <button className="ga-close" onClick={() => dismissBroadcast(b.id)} title="Dismiss">
                        <FiX />
                    </button>
                </div>
            ))}
        </div>
    );
}
