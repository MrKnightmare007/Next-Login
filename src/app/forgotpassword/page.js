'use client'
import styles from './forgotpassword.module.css';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import NoSsr from '@mui/material/NoSsr';
import { Bungee_Spice } from 'next/font/google';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Loader from '../components/loader';
import { getCookie, setCookie } from 'cookies-next';

const bungee_spice = Bungee_Spice({
    weight: "400",
    display: "swap",
    subsets: ['latin'],
});

const customTheme = (outerTheme) =>
    createTheme({
        palette: {
            mode: outerTheme.palette.mode,
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '--TextField-brandBorderColor': '#ed1111',
                        '--TextField-brandBorderHoverColor': '#ed1111',
                        '--TextField-brandBorderFocusedColor': '#ed1111',
                        '& label.Mui-focused': {
                            color: 'var(--TextField-brandBorderFocusedColor)',
                        },
                    },
                },
            },
            MuiInput: {
                styleOverrides: {
                    root: {
                        '&::before': {
                            borderBottom: '2px solid var(--TextField-brandBorderColor)',
                        },
                        '&:hover:not(.Mui-disabled, .Mui-error):before': {
                            borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
                        },
                        '&.Mui-focused:after': {
                            borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
                        },
                    },
                },
            },
        },
    });

export default function Forgotpassword() {
    const outerTheme = useTheme();
    const router = useRouter();  // Use Next.js router for navigation
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertFadeOut, setAlertFadeOut] = useState(false);
    const [alert, setAlert] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    useEffect(() => {
        const resetToken = getCookie('passwordResetToken');
        if (!resetToken) {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        if (showErrorAlert) {
            const timer = setTimeout(() => {
                setAlertFadeOut(true);
                const clearTimer = setTimeout(() => {
                    setAlertFadeOut(false);
                }, 600);
                setShowErrorAlert(false);
                return () => clearTimeout(clearTimer);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showErrorAlert]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let valid = true;
        if (!username) {
            setUsernameError("Username is required !!!");
            valid = false;
        } else {
            setUsernameError("");
        }
        if (valid) {
            setLoading(true);
            try {
                const response = await fetch(`/api/users/forgotpassword?username=${encodeURIComponent(username)}`);
                const data = await response.json();
    
                if (response.status === 200) {
                    // Proceed with sending OTP
                    try {
                        const res = await fetch('/api/users/send-otp', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ username }),
                        });
                        if (res.status === 200) {
                            const otpData = await res.json();
                            localStorage.setItem('forgotPasswordUsername', username);
                            localStorage.setItem('forgotPasswordEmail', otpData.email);
                            setIsSent(true);
                            setCookie('passwordResetStage', 'stage1', { path: '/' });
                            router.push('/otpcheck');
                        } else {
                            setShowErrorAlert(true);
                            setAlert("Failed to send OTP. Please try again.");
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        setShowErrorAlert(true);
                        setAlert("Failed to send OTP. Please try again.");
                    }
                } else if (response.status === 404) {
                    setShowErrorAlert(true);
                    setAlert("User not found !!!");
                } else {
                    setShowErrorAlert(true);
                    setAlert(data.error || "An unexpected error occurred. Please try again later.");
                }
            } catch (error) {
                console.error('Error:', error);
                setShowErrorAlert(true);
                setAlert('Failed to submit request. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (isSent) {
        return (
            <main className={styles.main}>
                <Loader />
            </main>
        );
    }

    return (
        <NoSsr>
            <main className={styles.main}>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <Fade in={showErrorAlert} timeout={600}>
                            <div className={styles.alertContainer}>
                                <Alert
                                    severity="error"
                                    sx={{ opacity: alertFadeOut ? 0 : 1, transition: 'opacity 0.6s ease-out' }}
                                >
                                    {alert}
                                </Alert>
                            </div>
                        </Fade>
                        <div className={styles.container}>
                            <h1 className={bungee_spice.className}>Forgot Password ?</h1>
                            <div>
                                <p style={{ fontSize: '20px' }}>Enter your Registered Username:</p>
                                <ThemeProvider theme={customTheme(outerTheme)}>
                                    <TextField
                                        label="Username"
                                        variant="standard"
                                        spellCheck="false"
                                        autoComplete="off"
                                        className={styles.txtfield}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        fullWidth
                                        sx={{ marginBottom: '14px', marginTop: '14px', minWidth: '50px', minHeight: '50px' }}
                                    />
                                </ThemeProvider>
                                {usernameError && <p className={styles.error}>{usernameError}</p>}
                            </div>
                            
                            <Button
                                variant="contained"
                                className={styles.btn}
                                fullWidth
                                onClick={handleSubmit}
                                sx={{
                                    backgroundColor: '#b90b0b',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: 'red',
                                    },
                                    padding: '10px',
                                    marginTop: '10px'
                                }}
                            >
                                Submit
                            </Button>
                        </div>
                    </>
                )}
            </main>
        </NoSsr>
    );
}
