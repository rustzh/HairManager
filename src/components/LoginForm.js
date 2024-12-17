import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // 에러 메시지 초기화

        try {
            // 서버로 로그인 요청
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password,
            });

            // 로그인 성공 시 사용자 이름과 토큰을 localStorage에 저장
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            alert(response.data.message);
            window.location.href = '/'; // 로그인 후 홈으로 리디렉션
        } catch (error) {
            console.error(error);
            setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
        }
    };

    return (
        <div className="login-form-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일"
                    className="login-input"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    className="login-input"
                    required
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button">로그인</button>
            </form>
        </div>
    );
}

export default LoginForm;