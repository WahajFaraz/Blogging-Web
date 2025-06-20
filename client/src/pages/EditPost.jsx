import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '../components/Editor';
import styled, { keyframes } from 'styled-components';
import {jwtDecode} from 'jwt-decode';
import { useTheme } from '../components/ThemeContext';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
`;

// Styled components
const FormContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  }
`;

const FormTitle = styled.h1`
  color: #1e293b;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '✏️';
    font-size: 1.5rem;
  }
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 1.25rem;
  margin-bottom: 2rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1.1rem;
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
    font-weight: 400;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const PrimaryButton = styled.button`
  background: #4ade80;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #22c55e;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 222, 128, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    animation: ${pulse} 1.5s infinite;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background: #f1f5f9;
  color: #64748b;

  &:hover {
    background: #e2e8f0;
    color: #475569;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
`;

const LoadingSpinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { theme } = useTheme();
  let loggedInUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      loggedInUserId = decoded.id || decoded._id;
    } catch {}
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        if (res.data.author && res.data.author == loggedInUserId) {
          alert("You are not authorized to edit this post.");
          navigate('/');
          return;
        }
      } catch (err) {
        alert('Failed to load post');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.put(`/posts/${id}`, { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/post/${id}`);
    } catch (err) {
      alert('Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate(`/post/${id}`);
  };

  if (isLoading) {
    return (
      <FormContainer>
        <FormTitle>Loading Post...</FormTitle>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormTitle>Edit Post</FormTitle>
      <form onSubmit={handleUpdate}>
        <TitleInput
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter post title..."
          required
          disabled={isUpdating}
        />
        <Editor value={content} onChange={setContent} />
        <ActionButtons>
          <SecondaryButton type="button" onClick={handleCancel} disabled={isUpdating}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <LoadingSpinner /> Updating...
              </>
            ) : (
              'Update Post'
            )}
          </PrimaryButton>
        </ActionButtons>
      </form>
    </FormContainer>
  );
};

export default EditPost;