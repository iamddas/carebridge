import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMessages, deleteMessage } from '../../api/adminApi';
import { showSuccess } from '../../utils/toast';
import { formatDate } from '../../utils/formatDate';
import './admin.css';

export default function AdminMessages() {
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['admin-messages'],
        queryFn: getAllMessages,
    });

    const deleteM = useMutation({
        mutationFn: deleteMessage,
        onSuccess: () => {
            showSuccess('Message deleted');
            queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
        },
    });

    const filtered = search.trim()
        ? messages.filter(
              (m) =>
                  m.sender?.name?.toLowerCase().includes(search.toLowerCase()) ||
                  m.receiver?.name?.toLowerCase().includes(search.toLowerCase()) ||
                  m.content?.toLowerCase().includes(search.toLowerCase())
          )
        : messages;

    return (
        <div className="page-container" style={{ maxWidth: 1100 }}>
            <div className="page-header">
                <div>
                    <h2 className="page-title">All Messages</h2>
                    <p className="page-subtitle" style={{ margin: 0 }}>{messages.length} total messages</p>
                </div>
            </div>

            <div className="search-bar">
                <input
                    className="search-input"
                    placeholder="Search by sender, receiver or content…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button className="btn-secondary" style={{ padding: '8px 14px' }} onClick={() => setSearch('')}>
                        Clear
                    </button>
                )}
            </div>

            {isLoading ? (
                <p className="loading-text">Loading…</p>
            ) : filtered.length === 0 ? (
                <p className="empty-state">No messages found.</p>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Message</th>
                                <th>Read</th>
                                <th>Sent</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((m) => (
                                <tr key={m.id}>
                                    <td style={{ fontWeight: 500 }}>{m.sender?.name}</td>
                                    <td>{m.receiver?.name}</td>
                                    <td style={{ maxWidth: 320, color: 'rgba(255,255,255,.7)' }}>
                                        <span title={m.content}>
                                            {m.content?.length > 80 ? m.content.slice(0, 80) + '…' : m.content}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ color: m.read ? '#86efac' : 'rgba(255,255,255,.35)', fontSize: '0.78rem' }}>
                                            {m.read ? '● Read' : '○ Unread'}
                                        </span>
                                    </td>
                                    <td style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                        {formatDate(m.createdAt)}
                                    </td>
                                    <td>
                                        <button
                                            className="btn-xs btn-xs-danger"
                                            onClick={() => {
                                                if (window.confirm('Delete this message?')) deleteM.mutate(m.id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
