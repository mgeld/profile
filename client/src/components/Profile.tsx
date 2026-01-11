import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ email: string; created_at: string } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:5000/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div> 
            <p>{user?.email}</p>
            <p>{user?.created_at}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Profile;