import React, { useEffect, useState } from 'react';
import './Login.css';
import MyBackground from './MyBackground.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const changeIsRegistering = () => {
        setIsRegistering(!isRegistering);
    };

    const handleInfor = async () => {
        const url = isRegistering ? 'http://127.0.0.1:5173/user/register' : 'http://127.0.0.1:5173/user/login';

        try {
            const response = await axios.post(url, {
                username: username,
                password: password
            });

            const result = response.data;

            if (result.success) {
                // 将用户 ID 存储到 localStorage 中
                localStorage.setItem('userId', result.userId);
                console.log('Stored user ID:', localStorage.getItem('userId'));
                navigate('/board');
            } else {
                alert('操作失败，请检查用户名和密码');
            }
        } catch (error) {
            console.error('请求失败:', error.message);
        }
    };

    return (
        <MyBackground>
            <div>
                <div className='form-group'>
                    <label htmlFor='username'>用户名: </label>
                    <input
                        type='text'
                        id='username'
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder='输入用户名'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>密码: </label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder='输入密码'
                    />
                </div>
                <div>
                    {/* 改变模式 */}
                    <button className='isRegistering' onClick={changeIsRegistering}>
                        {isRegistering ? '已经有账号? 点这里登录' : '还没有账号? 点这里注册'}
                    </button>
                </div>
                <div>
                    <button className='Login' onClick={handleInfor}>
                        {isRegistering ? '注册' : '登录'}
                    </button>
                </div>
            </div>
        </MyBackground>
    );
}

export default Login;
