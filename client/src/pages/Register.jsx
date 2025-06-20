import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../components/ThemeContext';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const RegisterContainer = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #6366f1, #8b5cf6, #ec4899, #f59e0b);
  background-size: 400% 400%;
  animation: ${gradient} 15s ease infinite;
`;

const RegisterForm = styled.form`
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.6s ease-out;
`;

const FormHeader = styled.h1`
  color: #1e293b;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
`;

const InputField = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    background-color: white;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to right, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: linear-gradient(to right, #4f46e5, #7c3aed);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const FormFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
  font-size: 0.9rem;
`;

const FormLink = styled(Link)`
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: #4f46e5;
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
`;

const Register = () => {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    } else {
      setProfilePicPreview(null);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('bio', bio);
      if (profilePic) formData.append('profilePic', profilePic);
      await axios.post('/users/signup', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleRegister}>
        <FormHeader>Create Account</FormHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <InputGroup>
          <InputLabel>Username</InputLabel>
          <InputIcon>
            <FiUser size={20} />
          </InputIcon>
          <InputField
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup>
          <InputLabel>Email</InputLabel>
          <InputIcon>
            <FiMail size={20} />
          </InputIcon>
          <InputField
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup>
          <InputLabel>Password</InputLabel>
          <InputIcon>
            <FiLock size={20} />
          </InputIcon>
          <InputField
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup>
          <InputLabel>Profile Picture</InputLabel>
          <InputField
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            disabled={isLoading}
            style={{ paddingLeft: '1rem' }}
          />
          {profilePicPreview && (
            <img src={profilePicPreview} alt="Preview" style={{ width: 60, height: 60, borderRadius: '50%', marginTop: 10, objectFit: 'cover', border: '2px solid #6366f1' }} />
          )}
        </InputGroup>

        <InputGroup>
          <InputLabel>Bio</InputLabel>
          <InputField
            as="textarea"
            rows={3}
            placeholder="Tell us about yourself (max 200 chars)"
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={200}
            disabled={isLoading}
            style={{ paddingLeft: '1rem', minHeight: 60 }}
          />
        </InputGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? (
            'Creating account...'
          ) : (
            <>
              Register <FiArrowRight size={18} />
            </>
          )}
        </SubmitButton>

        <FormFooter>
          Already have an account? <FormLink to="/login">Sign in</FormLink>
        </FormFooter>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;