import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserDirectory, getConversation, sendMessage } from '../../api/messageApi';
import { useAuth } from '../../context/AuthContext';
import { showSuccess } from '../../utils/toast';
import { formatDate } from '../../utils/formatDate';
import './chat.css';

export default function ChatPage() {
    const { user: me } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [text, setText] = useState('');
    const bottomRef = useRef(null);
    const queryClient = useQueryClient();

    const { data: allUsers = [] } = useQuery({
        queryKey: ['user-directory'],
        queryFn: getUserDirectory,
    });

    const otherUsers = allUsers.filter((u) => u.id !== me?.id);

    const { data: messages = [] } = useQuery({
        queryKey: ['conversation', selectedUser?.id],
        queryFn: () => getConversation(selectedUser.id),
        enabled: !!selectedUser,
    });

    const sendM = useMutation({
        mutationFn: sendMessage,
        onSuccess: () => {
            showSuccess('Message sent');
            setText('');
            queryClient.invalidateQueries({ queryKey: ['conversation', selectedUser?.id] });
        },
    });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim() || !selectedUser) return;
        sendM.mutate({ receiverId: selectedUser.id, content: text.trim() });
    };

    return (
        <div style={{ padding: '0 0 0 0' }}>
            <div className="page-header" style={{ marginBottom: 16 }}>
                <h2 className="page-title">Messages</h2>
            </div>

            <div className="chat-layout">
                {/* User list */}
                <div className="chat-sidebar">
                    <div className="chat-sidebar-header">Users</div>
                    {otherUsers.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,.35)', padding: '16px', fontSize: '0.85rem' }}>No other users</p>
                    ) : (
                        otherUsers.map((u) => (
                            <div
                                key={u.id}
                                className={`chat-user-item${selectedUser?.id === u.id ? ' active' : ''}`}
                                onClick={() => setSelectedUser(u)}
                            >
                                <div className="chat-user-avatar">{u.name[0]?.toUpperCase()}</div>
                                <div>
                                    <div className="chat-user-name">{u.name}</div>
                                    <div className="chat-user-role">{u.role}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Chat window */}
                {selectedUser ? (
                    <div className="chat-window">
                        <div className="chat-window-header">
                            <div className="chat-user-avatar">{selectedUser.name[0]?.toUpperCase()}</div>
                            <div>
                                <div className="chat-window-name">{selectedUser.name}</div>
                                <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.75rem' }}>{selectedUser.role}</div>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {messages.length === 0 ? (
                                <div className="chat-empty">Start the conversation…</div>
                            ) : (
                                messages.map((m) => {
                                    const isMine = m.sender.id === me?.id;
                                    return (
                                        <div key={m.id} className={`chat-bubble-wrap ${isMine ? 'mine' : 'theirs'}`}>
                                            <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>{m.content}</div>
                                            <span className="chat-time">{formatDate(m.createdAt)}</span>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={bottomRef} />
                        </div>

                        <form className="chat-input-bar" onSubmit={handleSend}>
                            <input
                                className="chat-input"
                                placeholder="Type a message…"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <button className="chat-send-btn" type="submit" disabled={!text.trim() || sendM.isPending}>
                                Send
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="no-chat-selected">Select a user to start chatting</div>
                )}
            </div>
        </div>
    );
}
