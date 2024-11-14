import React, { useState } from 'react';
import axios from 'axios';
import './SignupForm.css';

function SignupForm() {
    const [Email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/signup', {
                email: Email,  // 이메일 필드 추가
                username,
                password,
            });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            setError("회원가입에 실패했습니다.");
        }
    };

    return (
        <div className="signup-form-container">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    type="text"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일"
                    className="signup-input"
                />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="아이디"
                    className="signup-input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    className="signup-input"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호 확인"
                    className="signup-input"
                />
                {error && <div className="error-message">{error}</div>} {/* 오류 메시지 출력 */}
                <button type="submit" className="signup-button">회원가입</button>
            </form>
        </div>
    );
}

export default SignupForm;