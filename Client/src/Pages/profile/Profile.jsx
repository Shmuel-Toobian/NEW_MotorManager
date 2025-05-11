import React, { useState } from 'react';

import style from './profile.module.css';
import { useAuth } from '../../store/authProvider';

const Profile = () => {
  const { user, updatePassword } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("The passwords do not match");
      return;
    }
    try {
      await updatePassword(user._id, currentPassword, newPassword);
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || "Error to change the password");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className={style.profileContainer}>
      <div className={style.profileHeader}>
        <div className={style.profileCircle}>
          {user.firstName && user.lastName 
            ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
            : '?'}
        </div>
        <h1>{user.firstName} {user.lastName}</h1>
      </div>
      <div className={style.profileDetails}>
        <div className={style.detailItem}>
          <span className={style.label}>Email:</span>
          <span>{user.email}</span>
        </div>
        <div className={style.detailItem}>
          <span className={style.label}>Phone:</span>
          <span>{user.phone}</span>
        </div>
        <div className={style.detailItem}>
          <span className={style.label}>Address:</span>
          <span>{user.address}</span>
        </div>
        <div className={style.detailItem}>
          <span className={style.label}>סיסמה:</span>
          {isChangingPassword ? (
            <form onSubmit={handlePasswordChange} className={style.passwordForm}>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                required
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="New password Confirmation"
                required
              />
              {error && <div className={style.error}>{error}</div>}
              <div className={style.buttonGroup}>
                <button type="submit">Save</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsChangingPassword(false);
                    setError('');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button onClick={() => setIsChangingPassword(true)}>
              שנה סיסמה
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;