import React from 'react';
import './Input.css';

function Input({ label, onChange, placeholder, type, value, icon, onIconClick }) {
  return (
    <>
      <label className="username ml-40" htmlFor="username">
        {label}
      </label>
      <div className="input-container ml-40">
        <div className="input-field">
          <input type={type} className="input" onChange={onChange} placeholder={placeholder} value={value} />
          <div className="input-icon" onClick={onIconClick}>
            {icon}
          </div>
        </div>
      </div>
    </>
  );
}

export default Input;

Input.defaultProps = {
  label: 'Username',
  placeholder: 'Enter your username',
  type: 'text',
  value: '',
  icon: null,
  onIconClick: () => { },
};
