import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();

    const handleSubmitForRegister = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/register', { email, password })
            if (response.data) {
                alert('Успешная регистрация')
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmitForRegister}>
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

                <button>Register</button>
            </form>
        </>
    )
}

export default Register;