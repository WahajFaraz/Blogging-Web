import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../components/ThemeContext';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(100, 108, 255, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(100, 108, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(100, 108, 255, 0); }
`;

// Styled components
const FormContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.5s ease-out;
`;

const FormTitle = styled.h1`
  color: #1e293b;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 2rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #646cff;
    box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.2);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const MediaInput = styled.input`
  display: block;
  margin: 1.5rem 0 1rem 0;
`;

const MediaPreview = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
  img, video {
    max-width: 100%;
    max-height: 320px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(100, 108, 255, 0.10);
    margin: 0 auto;
    display: block;
  }
`;

const SubmitButton = styled.button`
  background: #646cff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1.5rem;
  width: 100%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(100, 108, 255, 0.3);
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

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { theme } = useTheme();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    } else {
      setMediaPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (media) formData.append('media', media);
      await axios.post('/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (err) {
      alert('Post creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Create New Post</FormTitle>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TitleInput
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter your post title..."
          required
          disabled={isSubmitting}
        />
        <Editor value={content} onChange={setContent} />
        <MediaInput
          type="file"
          accept="image/*,video/*,image/gif"
          onChange={handleMediaChange}
          disabled={isSubmitting}
        />
        {mediaPreview && (
          <MediaPreview>
            {media && media.type.startsWith('video') ? (
              <video src={mediaPreview} controls />
            ) : (
              <img src={mediaPreview} alt="Preview" />
            )}
          </MediaPreview>
        )}
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner /> Publishing...
            </>
          ) : (
            'Publish Post'
          )}
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default CreatePost;