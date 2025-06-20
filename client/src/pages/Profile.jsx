import React, { useEffect, useState, useCallback } from 'react';
import axios from '../api/axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaSignOutAlt, FaTrash, FaMoon, FaSun, FaLock, FaImage, FaBook, FaCommentDots, FaHeart, FaCog, FaSave } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';

const ProfileContainer = styled.div`
  padding: 2rem 1rem;
  background: ${({ theme }) => (theme === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)')};
  color: ${({ theme }) => (theme === 'dark' ? '#e2e8f0' : '#1e293b')};
  min-height: 100vh;
  transition: background 0.3s ease;
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => (theme === 'dark' ? '#1e293b' : 'white')};
  border: 1px solid ${({ theme }) => (theme === 'dark' ? '#334155' : '#e2e8f0')};
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const ProfilePicContainer = styled.div`
  position: relative;
  text-align: center;
`;

const ProfilePic = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #6366f1;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  svg {
    color: #6366f1;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => (theme === 'dark' ? '#334155' : '#e2e8f0')};
  padding-bottom: 1rem;
`;

const TabButton = styled.button`
  background: transparent;
  color: ${({ active, theme }) => (active ? '#6366f1' : (theme === 'dark' ? '#94a3b8' : '#64748b'))};
  border: none;
  border-bottom: 3px solid ${({ active }) => (active ? '#6366f1' : 'transparent')};
  padding: 0.7rem 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const ActionButton = styled.button`
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }
`;

const DangerButton = styled(ActionButton)`
  background: #dc2626;
  &:hover { background: #b91c1c; }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => (theme === 'dark' ? '#1e293b' : 'white')};
  color: ${({ theme }) => (theme === 'dark' ? '#e2e8f0' : '#1e293b')};
  border-radius: 16px;
  padding: 2rem 2.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ username: '', bio: '', profilePic: null });
  const [tab, setTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
      setEditData({ username: res.data.username, bio: res.data.bio, profilePic: null });
      
      const postsRes = await axios.get(`/posts?author=${res.data._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts(postsRes.data);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert('Failed to fetch profile. Please try again later.');
      }
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
    document.body.className = theme;
  }, [fetchProfile, theme]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('username', editData.username);
    formData.append('bio', editData.bio);
    if (editData.profilePic) formData.append('profilePic', editData.profilePic);
    try {
      await axios.put('/users/me', formData, { headers: { Authorization: `Bearer ${token}` } });
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handlePasswordReset = async () => {
    if (!window.confirm("Send a password reset link to your email?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.post('/users/me/reset-password', {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('Password reset email sent!');
    } catch (err) {
      alert('Failed to send password reset email');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('theme');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete('/users/me', { headers: { Authorization: `Bearer ${token}` } });
      handleLogout();
    } catch (err) {
      alert('Failed to delete account');
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Delete this post?")) {
      const token = localStorage.getItem("token");
      await axios.delete(`/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    }
  };

  if (loading) return <ProfileContainer theme={theme}>Loading...</ProfileContainer>;
  if (!user) return null;

  return (
    <ProfileContainer theme={theme}>
      <Card theme={theme} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <ProfileHeader>
          <ProfilePicContainer>
            <ProfilePic src={user.profilePic || `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`} alt="Profile" />
          </ProfilePicContainer>
          <ProfileInfo>
            <h2>{user.username}</h2>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>{user.bio || 'No bio yet.'}</p>
            <InfoRow><FaEnvelope /> <span>{user.email}</span></InfoRow>
            <InfoRow><FaCalendarAlt /> <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span></InfoRow>
          </ProfileInfo>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <ActionButton onClick={() => setEditMode(!editMode)}><FaEdit /> {editMode ? 'Cancel' : 'Edit Profile'}</ActionButton>
             <ActionButton onClick={handlePasswordReset}><FaLock /> Reset Password</ActionButton>
          </div>
        </ProfileHeader>
        <AnimatePresence>
        {editMode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <form onSubmit={handleEditSubmit} style={{ marginTop: '2rem' }}>
              <input name="username" value={editData.username} onChange={(e) => setEditData({...editData, username: e.target.value})} placeholder="Username" required />
              <textarea name="bio" value={editData.bio} onChange={(e) => setEditData({...editData, bio: e.target.value})} placeholder="Bio" maxLength={200} />
              <input name="profilePic" type="file" accept="image/*" onChange={(e) => setEditData({...editData, profilePic: e.target.files[0]})} />
              <ActionButton type="submit"><FaSave /> Save Changes</ActionButton>
            </form>
          </motion.div>
        )}
        </AnimatePresence>
      </Card>

      <Card theme={theme}>
        <Tabs theme={theme}>
          <TabButton theme={theme} active={tab === 'posts'} onClick={() => setTab('posts')}><FaBook /> My Posts ({posts.length})</TabButton>
          <TabButton theme={theme} active={tab === 'comments'} onClick={() => setTab('comments')}><FaCommentDots /> My Comments (0)</TabButton>
          <TabButton theme={theme} active={tab === 'stats'} onClick={() => setTab('stats')}><FaHeart /> Statistics</TabButton>
        </Tabs>
        <div>
          {tab === 'posts' && (posts.length === 0 ? <p>No posts yet.</p> : posts.map(post => <div key={post._id}>{post.title}</div>))}
          {tab === 'comments' && <p>Comments feature coming soon.</p>}
          {tab === 'stats' && <p>Likes: 0, Comments: 0</p>}
        </div>
      </Card>
      
      <Card theme={theme}>
        <h3>Settings</h3>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <ActionButton onClick={toggleTheme}>
              {theme === 'light' ? <FaMoon /> : <FaSun />} Toggle Theme
            </ActionButton>
          </div>
          <div>
            <ActionButton onClick={handleLogout}><FaSignOutAlt /> Logout</ActionButton>
            <DangerButton onClick={() => setShowDeleteModal(true)} style={{marginLeft: '1rem'}}><FaTrash /> Delete Account</DangerButton>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {showDeleteModal && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalContent theme={theme} initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
              <h2>Are you sure?</h2>
              <p>This action is irreversible and will permanently delete your account and all associated data.</p>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <DangerButton onClick={handleDeleteAccount}>Yes, Delete My Account</DangerButton>
                <ActionButton onClick={() => setShowDeleteModal(false)}>Cancel</ActionButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </ProfileContainer>
  );
};

export default Profile;
