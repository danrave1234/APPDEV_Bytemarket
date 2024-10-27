import { useAuth } from './AuthProvider.jsx';
import { Navigate } from 'react-router-dom';

function ProtectedPage() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return <div>Protected content</div>;
}
