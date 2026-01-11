import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const navigate = useNavigate();

    const handleSubmitForLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', {email, password});
            localStorage.setItem('authToken', response.data);
            navigate('/profile');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmitForLogin}>
                <input
                    placeholder="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button>Login</button>
            </form>
        </>
    )
}

export default Login;