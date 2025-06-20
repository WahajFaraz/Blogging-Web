import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import "./Navbar.css";
import { useTheme } from './ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const underline = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// Styled components
const NavContainer = styled.nav`
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: ${fadeIn} 0.6s ease-out;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: 1rem;
    flex-wrap: wrap;
  }
`;

const NavLink = styled(Link)`
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;

  &:hover {
    color: #ffffff;
    transform: translateY(-2px);
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background: #646cff;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
    animation: ${underline} 0.3s ease;
  }

  &.active {
    color: #646cff;

    &::after {
      transform: scaleX(1);
      background: #646cff;
    }
  }
`;

const NavDivider = styled.span`
  color: rgba(226, 232, 240, 0.3);
  font-weight: 300;
  user-select: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <NavContainer>
      <NavList>
        {token ? (
          <>
            <NavLink to="/">Home</NavLink>
            <NavDivider>|</NavDivider>
            <NavLink to="/create">Create Post</NavLink>
            <NavDivider>|</NavDivider>
            <NavLink to="/profile">Profile</NavLink>
            <NavDivider>|</NavDivider>
            <button onClick={toggleTheme} className="theme-toggle" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e2e8f0', fontSize: '1.2rem', marginRight: '1rem' }}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavDivider>|</NavDivider>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </NavList>
    </NavContainer>
  );
};

export default Navbar;
