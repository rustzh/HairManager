import React, { useState } from 'react';
import axios from 'axios';
import './SignupForm.css';

function SignupForm() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState(''); // 이름 입력 필드
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 비밀번호 확인
        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            // 서버로 회원가입 요청 보내기
            const response = await axios.post('http://localhost:5000/api/users/register', {
                email,
                name, // 이름을 전송
                password,
            });

            alert(response.data.message); // 성공 메시지 출력
        } catch (error) {
            console.error(error);
            setError("회원가입에 실패했습니다."); // 실패 메시지 출력
        }
    };

    return (
        <div className="signup-form-container">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일"
                    className="signup-input"
                    required
                />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름"
                    className="signup-input"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    className="signup-input"
                    required
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호 확인"
                    className="signup-input"
                    required
                />
                {error && <div className="error-message">{error}</div>} {/* 오류 메시지 출력 */}
                <button type="submit" className="signup-button">회원가입</button>
            </form>
        </div>
    );
}

export default SignupForm;