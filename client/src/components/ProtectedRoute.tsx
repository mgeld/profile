import { useNavigate } from "react-router-dom";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}


function ProtectedRoute({ children }: ProtectedRouteProps) {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) navigate('/login');
    }, [navigate])

    return <>{children}</>
}

export default ProtectedRoute;