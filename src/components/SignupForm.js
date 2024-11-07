// src/components/SignupForm.js
import React, { useState } from 'react';
import './SignupForm.css';

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://your-api-endpoint/signup', {  // 실제 서버의 API 주소로 변경
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('회원가입에 실패했습니다.');
      }

      const data = await response.json();
      console.log('서버 응답:', data);
      alert('회원가입이 완료되었습니다!');

    } catch (error) {
      console.error('Error:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>회원가입</h2>
      <label>
        사용자명:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        이메일:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        비밀번호:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">회원가입</button>
    </form>
  );
}

export default SignupForm;