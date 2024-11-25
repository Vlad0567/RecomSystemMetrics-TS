import React, { useState, CSSProperties } from 'react';

// Определяем типы для пропсов
interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
  disabled?: boolean;
  backgroundColor?: string;
  hoverColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  type = "button",
  style,
  disabled = false,
  backgroundColor = "#007BFF",
  hoverColor = "#0056b3"
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Базовые стили кнопки
  const baseStyle: CSSProperties = {
    padding: '0.625rem 0.9375rem',
    backgroundColor: disabled ? '#aaa' : (isHovered ? hoverColor : backgroundColor),
    color: '#fff',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.5s',
    ...style
  };

  return (
    <button
      onClick={onClick}
      type={type}
      style={baseStyle}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Button;
