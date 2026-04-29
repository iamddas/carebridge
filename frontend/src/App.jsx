import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import GlobalAlerts from './components/GlobalAlerts';
import AppRoutes from './routes/AppRoutes';
import './App.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: 1, staleTime: 30_000 },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <WebSocketProvider>
                        <AppRoutes />
                        <GlobalAlerts />
                        <ToastContainer theme="dark" />
                    </WebSocketProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

