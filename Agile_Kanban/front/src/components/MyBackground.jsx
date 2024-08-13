import React, { useState } from 'react';
import './MyBackground.css';
import logo from "../assets/image/logo.png";

function MyBackground({ children }) {
  const [bgColor, setBgColor] = useState('black');
  const [chColor, setChColor] = useState('black');
  const [heColor, setHeColor] = useState('white');

  const changeColor = () => {
    setBgColor(bgColor === 'white' ? 'black' : 'white');
    setChColor(chColor === 'white' ? 'black' : 'white');
    setHeColor(heColor === 'white' ? 'black' : 'white');
  };

  return (
    <div className="background" style={{ backgroundColor: bgColor }}>
      <button className='button' onClick={changeColor} style={{ color: chColor }}>Change Background Color</button>
      <div className="login-container">
        <h2 className='header' style={{ color: heColor }}>敏捷看板</h2>
        <img src={logo} alt="Logo" className='logo' />
      </div>
      {children}
    </div>
  );
}

export default MyBackground;
