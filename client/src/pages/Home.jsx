import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {jwtDecode} from "jwt-decode";
import { useTheme } from '../components/ThemeContext';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleUp = keyframes`
  from { transform: scale(0.95); }
  to { transform: scale(1); }
`;

// Styled components
const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const PageHeader = styled.h2`
  color: #1e293b;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(to right, #6366f1, #8b5cf6);
    border-radius: 2px;
  }
`;

const SearchBar = styled(motion.input)`
  display: block;
  margin: 2rem auto 1.5rem auto;
  padding: 0.75rem 1.25rem;
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 1.1rem;
  background: #f8fafc;
  box-shadow: 0 2px 8px rgba(100, 108, 255, 0.07);
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
    border: 1.5px solid #6366f1;
    box-shadow: 0 4px 16px rgba(100, 108, 255, 0.13);
  }
`;

const PostsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PostCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 5px 24px rgba(100, 108, 255, 0.09);
  transition: all 0.3s cubic-bezier(.4,2,.3,1);
  border: 1px solid #e2e8f0;
  position: relative;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 12px 32px rgba(100, 108, 255, 0.18);
  }
`;

const PostContent = styled.div`
  padding: 1.5rem;
`;

const PostTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
  a {
    color: #1e293b;
    text-decoration: none;
    transition: all 0.2s ease;
    &:hover {
      color: #6366f1;
    }
  }
`;

const PostAuthor = styled.p`
  color: #64748b;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const PostActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditButton = styled(ActionButton)`
  background: #e0e7ff;
  color: #4f46e5;

  &:hover {
    background: #c7d2fe;
  }
`;

const DeleteButton = styled(ActionButton)`
  background: #fee2e2;
  color: #dc2626;

  &:hover {
    background: #fecaca;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 1.2rem;
`;

const NoPosts = styled.div`
  text-align: center;
  color: #cbd5e1;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const MediaThumb = styled.div`
  width: 100%;
  max-height: 220px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  img, video {
    width: 100%;
    max-height: 220px;
    object-fit: cover;
    border-radius: 0;
    display: block;
  }
`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/posts");
        setPosts(res.data);
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setLoggedInUserId(decoded.id || decoded._id);
          } catch {}
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (postId) => {
    if (window.confirm("Delete this post?")) {
      const token = localStorage.getItem("token");
      await axios.delete(`/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    }
  };

  return (
    <HomeContainer>
      <PageHeader
        as={motion.h2}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Explore Posts
      </PageHeader>
      <SearchBar
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      {loading ? (
        <LoadingMessage
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading posts...
        </LoadingMessage>
      ) : filteredPosts.length === 0 ? (
        <NoPosts
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No posts found.
        </NoPosts>
      ) : (
        <PostsGrid
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                whileHover={{ scale: 1.03, boxShadow: "0 12px 32px rgba(100, 108, 255, 0.18)" }}
              >
                {post.mediaUrl && (
                  <MediaThumb>
                    {post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video src={post.mediaUrl} controls preload="metadata" />
                    ) : (
                      <img src={post.mediaUrl} alt="Post media" />
                    )}
                  </MediaThumb>
                )}
                <PostContent>
                  <PostTitle>
                    <Link to={`/post/${post._id}`}>{post.title}</Link>
                  </PostTitle>
                  <PostAuthor>
                    By {post.author?.username || "Unknown Author"}
                  </PostAuthor>
                  {String(post.author?._id || post.author) === String(loggedInUserId) && (
                    <PostActions>
                      <EditButton onClick={() => navigate(`/edit/${post._id}`)}>Edit</EditButton>
                      <DeleteButton onClick={() => handleDelete(post._id)}>Delete</DeleteButton>
                    </PostActions>
                  )}
                </PostContent>
              </PostCard>
            ))}
          </AnimatePresence>
        </PostsGrid>
      )}
    </HomeContainer>
  );
};

export default Home;
