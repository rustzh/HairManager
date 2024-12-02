import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

function LoginForm() {
    const [email, setEmail] = useState(''); // 이메일 입력 필드
    const [password, setPassword] = useState(''); // 비밀번호 입력 필드
    const [error, setError] = useState(''); // 에러 메시지 상태

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // 에러 메시지 초기화

        try {
            // 서버로 로그인 요청
            const response = await axios.post('http://localhost:5000/login', {
                email, // 이메일로 전송
                password,
            });

            alert(response.data.message); // 성공 메시지 출력
        } catch (error) {
            console.error(error);
            setError('로그인에 실패했습니다.'); // 실패 메시지 표시
        }
    };

    return (
        <div className="login-form-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email" // 이메일 입력 필드
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
                {error && <div className="error-message">{error}</div>} {/* 에러 메시지 출력 */}
                <button type="submit" className="login-button">로그인</button>
            </form>
        </div>
    );
}

export default LoginForm;