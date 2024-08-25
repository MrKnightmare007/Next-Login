'use client'

import { useState, useEffect, Suspense } from 'react';
import styles from "@/app/profile/profile.module.css";
import Button from '@mui/material/Button';
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Bungee_Spice } from 'next/font/google';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Loader from '../components/loader';
import DeleteIcon from '@mui/icons-material/Delete';
import { NoSsr } from '@mui/material';

const bungee_spice = Bungee_Spice({
  weight: "400",
  display: "swap",
  subsets: ['latin'],
});

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertFadeOut, setAlertFadeOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedout, setIsLoggedout] = useState(false);

  return (
    <Suspense fallback={<Loader />}>
      <ProfileContent
        user={user}
        setUser={setUser}
        showSuccessAlert={showSuccessAlert}
        setShowSuccessAlert={setShowSuccessAlert}
        alertFadeOut={alertFadeOut}
        setAlertFadeOut={setAlertFadeOut}
        loading={loading}
        setLoading={setLoading}
        isLoggedout={isLoggedout}
        setIsLoggedout={setIsLoggedout}
        router={router}
      />
    </Suspense>
  );
}

function ProfileContent({
  user,
  setUser,
  showSuccessAlert,
  setShowSuccessAlert,
  alertFadeOut,
  setAlertFadeOut,
  loading,
  setLoading,
  isLoggedout,
  setIsLoggedout,
  router,
}) {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  useEffect(() => {
    if (message) {
      setShowSuccessAlert(true);
      setAlertFadeOut(false); // Reset fade-out state
      const timer = setTimeout(() => {
        setAlertFadeOut(true); // Start fade-out
        const clearTimer = setTimeout(() => {
          setAlertFadeOut(false); // Reset fade-out state
          const currentUrl = window.location.href;
          const newUrl = currentUrl.replace(`?message=${encodeURIComponent(message)}`, '');
          router.replace(newUrl, undefined, { shallow: true });
        }, 600); // Match the fade duration
        setShowSuccessAlert(false);
        return () => clearTimeout(clearTimer);
      }, 5000); // Show alert for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/users/profile');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router, searchParams]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/users/logout');
      if (response.status === 200) {
        setIsLoggedout(true);
        router.push('/login?message=Logged out successfully');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete('/api/users/profile');
      if (response.status === 200) {
        router.push('/login?delmessage=User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.main}>
        <Loader />
      </div>
    );
  }

  if (isLoggedout) {
    return (
      <div className={styles.main}>
        <Loader />
      </div>
    );
  }

  return (
    <NoSsr>
      <main className={styles.main}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Fade in={showSuccessAlert} timeout={600}>
              <div className={styles.alertContainer}>
                <Alert severity='success' className={styles.alert} sx={{ opacity: alertFadeOut ? 0 : 1, transition: 'opacity 0.6s ease-out' }}>
                  {message}
                </Alert>
              </div>
            </Fade>
            <div className={styles.container}>
              <h1 className={bungee_spice.className} style={{ textAlign: 'center', fontSize: '35px' }}>WELCOME</h1>
              <div className={styles.userInfo}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <Button
                variant="contained"
                className={styles.btn}
                onClick={handleLogout}
                fullWidth
                sx={{
                  backgroundColor: 'red',
                  color: 'white',
                  '&:hover': { backgroundColor: 'red', color: 'white' }
                }}
              >
                LOG-OUT
              </Button>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                className={styles.delbtn}
                onClick={handleDelete}
                fullWidth
                sx={{
                  backgroundColor: 'blue',
                  color: 'white',
                  '&:hover': { backgroundColor: 'blue', color: 'white' }
                }}
              >
                DELETE USER
              </Button>
            </div>
          </>
        )}
      </main>
    </NoSsr>
  );
}
