import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password,
            });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            setError("로그인에 실패했습니다.");
        }
    };

    return (
        <div className="login-form-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="아이디"
                    className="login-input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    className="login-input"
                />
                {error && <div className="error-message">{error}</div>} {/* 오류 메시지 출력 */}
                <button type="submit" className="login-button">로그인</button>
            </form>
        </div>
    );
}

export default LoginForm;
