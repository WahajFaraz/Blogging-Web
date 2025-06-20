import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiTwitter, FiFacebook } from 'react-icons/fi';
import { useTheme } from '../components/ThemeContext';

// Styled components
const PostContainer = styled(motion.div)`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: #6366f1;
    transform: translateX(-3px);
  }
`;

const PostHeader = styled(motion.div)`
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1.5rem;
`;

const PostTitle = styled(motion.h1)`
  color: #1e293b;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

const PostMeta = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  font-size: 0.95rem;
`;

const PostAuthor = styled.span`
  font-weight: 500;
`;

const PostDate = styled.span`
  color: #94a3b8;
`;

const PostContent = styled(motion.div)`
  line-height: 1.8;
  color: #334155;

  & > * {
    margin-bottom: 1.5rem;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #1e293b;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  h2 {
    font-size: 1.8rem;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
  }

  a {
    color: #6366f1;
    text-decoration: none;
    transition: all 0.2s ease;
    border-bottom: 1px solid #6366f130;

    &:hover {
      color: #4f46e5;
      border-bottom-color: #4f46e5;
    }
  }

  ul, ol {
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  blockquote {
    border-left: 4px solid #8b5cf6;
    padding-left: 1.5rem;
    margin: 2rem 0;
    color: #475569;
    font-style: italic;
  }

  code {
    background: #f1f5f9;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 0.95em;
  }

  pre {
    background: #1e293b;
    color: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.9rem;
    line-height: 1.5;

    code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 2rem 0;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
`;

const SocialShareContainer = styled(motion.div)`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  
  h3 {
    margin-bottom: 1rem;
    color: #475569;
    font-weight: 500;
  }
`;

const ShareButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &.twitter {
    background-color: #e0f2fe;
    color: #0ea5e9;
    &:hover { background-color: #bae6fd; }
  }

  &.facebook {
    background-color: #e0f2fe;
    color: #3b5998;
    &:hover { background-color: #dbeafe; }
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem;
  color: #64748b;
  font-size: 1.2rem;
`;

const MediaDisplay = styled(motion.div)`
  width: 100%;
  max-height: 420px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 12px;
  margin-bottom: 2rem;
  img, video {
    width: 100%;
    max-height: 420px;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(100, 108, 255, 0.13);
    display: block;
  }
`;

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const postUrl = window.location.href;
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <LoadingContainer>Loading post...</LoadingContainer>;
  if (!post) return <LoadingContainer>Sorry, this post could not be found.</LoadingContainer>;

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <PostContainer>
      <BackButton to="/">
        <FiArrowLeft /> Back to all posts
      </BackButton>
      {post.mediaUrl && (
        <MediaDisplay
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <video src={post.mediaUrl} controls preload="metadata" />
          ) : (
            <img src={post.mediaUrl} alt="Post media" />
          )}
        </MediaDisplay>
      )}
      <PostHeader>
        <PostTitle custom={0} initial="hidden" animate="visible" variants={variants}>{post.title}</PostTitle>
        <PostMeta custom={1} initial="hidden" animate="visible" variants={variants}>
          <PostAuthor>By {post.author?.username || 'Unknown Author'}</PostAuthor>
          <PostDate>
            {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </PostDate>
        </PostMeta>
      </PostHeader>

      <PostContent
        custom={2}
        initial="hidden"
        animate="visible"
        variants={variants}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <SocialShareContainer custom={3} initial="hidden" animate="visible" variants={variants}>
        <h3>Share this post</h3>
        <div>
          <ShareButton className="twitter" href={`https://twitter.com/intent/tweet?url=${postUrl}&text=${post.title}`} target="_blank" rel="noopener noreferrer">
            <FiTwitter/> Twitter
          </ShareButton>
          <ShareButton className="facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`} target="_blank" rel="noopener noreferrer">
            <FiFacebook/> Facebook
          </ShareButton>
        </div>
      </SocialShareContainer>
    </PostContainer>
  );
};

export default PostDetail;