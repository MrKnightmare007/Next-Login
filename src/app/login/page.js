'use client';
import { Suspense } from 'react';
import Button from '@mui/material/Button';
import { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/login/login.module.css';
import axios from 'axios';
import Loader from '../components/loader.js';
import { Bungee_Spice } from 'next/font/google';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import { setCookie } from 'cookies-next';

const bungee_spice = Bungee_Spice({
    weight: "400",
    display: "swap",
    subsets: ['latin'],
});

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#ed1111',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#ed1111',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#ed1111',
        },
        '&:hover fieldset': {
            borderColor: '#ed1111',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#6F7E8C',
        },
    },
});

const defaultData = { username: "", password: "" };

export default function Login() {
    const [isRegisterHovered, setIsRegisterHovered] = useState(false);
    const [isForgetPassHovered, setIsForgetPassHovered] = useState(false);
    const [seepass, setSeepass] = useState('password');
    const [data, setData] = useState(defaultData);
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [isForgot, setIsForgot] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showWarningAlert, setShowWarningAlert] = useState(false);
    const [forgetpass, setForgetpass] = useState(false);
    const [alertFadeOut, setAlertFadeOut] = useState(false);
    const router = useRouter();

    return (
        <Suspense fallback={<Loader />}>
            <LoginContent
                isRegisterHovered={isRegisterHovered}
                setIsRegisterHovered={setIsRegisterHovered}
                isForgetPassHovered={isForgetPassHovered}
                setIsForgetPassHovered={setIsForgetPassHovered}
                seepass={seepass}
                setSeepass={setSeepass}
                data={data}
                setData={setData}
                usernameError={usernameError}
                setUsernameError={setUsernameError}
                passwordError={passwordError}
                setPasswordError={setPasswordError}
                loading={loading}
                setLoading={setLoading}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                loginError={loginError}
                setLoginError={setLoginError}
                isForgot={isForgot}
                setIsForgot={setIsForgot}
                showErrorAlert={showErrorAlert}
                setShowErrorAlert={setShowErrorAlert}
                showSuccessAlert={showSuccessAlert}
                setShowSuccessAlert={setShowSuccessAlert}
                showWarningAlert={showWarningAlert}
                setShowWarningAlert={setShowWarningAlert}
                forgetpass={forgetpass}
                setForgetpass={setForgetpass}
                alertFadeOut={alertFadeOut}
                setAlertFadeOut={setAlertFadeOut}
                router={router}
            />
        </Suspense>
    );
}

function LoginContent({
    isRegisterHovered,
    setIsRegisterHovered,
    isForgetPassHovered,
    setIsForgetPassHovered,
    seepass,
    setSeepass,
    data,
    setData,
    usernameError,
    setUsernameError,
    passwordError,
    setPasswordError,
    loading,
    setLoading,
    isLoggedIn,
    setIsLoggedIn,
    loginError,
    setLoginError,
    isForgot,
    setIsForgot,
    showErrorAlert,
    setShowErrorAlert,
    showSuccessAlert,
    setShowSuccessAlert,
    showWarningAlert,
    setShowWarningAlert,
    forgetpass,
    setForgetpass,
    alertFadeOut,
    setAlertFadeOut,
    router
}) {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const delmessage = searchParams.get('delmessage');
    const passmessage = searchParams.get('passmessage');

    const handleForgotPasswordClick = useCallback(() => {
        setIsForgot(true);
        const resetToken = Math.random().toString(36).substr(2, 8);
        setCookie('passwordResetToken', resetToken, {
            maxAge: 60 * 10,
            path: '/',
        });
        setLoading(true);
        router.push('/forgotpassword');
    }, [router, setIsForgot, setLoading]);

    useEffect(() => {
        if (message) {
            setShowSuccessAlert(true);
            setAlertFadeOut(false);
            const timer = setTimeout(() => {
                setAlertFadeOut(true);
                const clearTimer = setTimeout(() => {
                    setAlertFadeOut(false);
                    const currentUrl = window.location.href;
                    const newUrl = currentUrl.replace(`?message=${encodeURIComponent(message)}`, '');
                    router.replace(newUrl, undefined, { shallow: true });
                }, 600);
                setShowSuccessAlert(false);
                return () => clearTimeout(clearTimer);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, router, setShowSuccessAlert, setAlertFadeOut]);

    useEffect(() => {
        if (delmessage) {
            setShowWarningAlert(true);
            setAlertFadeOut(false);
            const timer = setTimeout(() => {
                setAlertFadeOut(true);
                const clearTimer = setTimeout(() => {
                    setAlertFadeOut(false);
                    const currentUrl = window.location.href;
                    const newUrl = currentUrl.replace(`?delmessage=${encodeURIComponent(delmessage)}`, '');
                    router.replace(newUrl, undefined, { shallow: true });
                }, 600);
                setShowWarningAlert(false);
                return () => clearTimeout(clearTimer);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [delmessage, router, setShowWarningAlert, setAlertFadeOut]);

    useEffect(() => {
        if (passmessage) {
            setShowSuccessAlert(true);
            setAlertFadeOut(false);
            const timer = setTimeout(() => {
                setAlertFadeOut(true);
                const clearTimer = setTimeout(() => {
                    setAlertFadeOut(false);
                    const currentUrl = window.location.href;
                    const newUrl = currentUrl.replace(`?passmessage=${encodeURIComponent(passmessage)}`, '');
                    router.replace(newUrl, undefined, { shallow: true });
                }, 600);
                setShowSuccessAlert(false);
                return () => clearTimeout(clearTimer);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [passmessage, router, setShowSuccessAlert, setAlertFadeOut]);

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
    }, [showErrorAlert, setAlertFadeOut, setShowErrorAlert]);

    const onValueChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });

        if (name === "username" && usernameError) {
            setUsernameError("");
        }
        if (name === "password" && passwordError) {
            setPasswordError("");
        }
    };

    const onLogin = async (e) => {
        e.preventDefault();
        let valid = true;
        if (!data.username) {
            setUsernameError("Name should not be empty !!!");
            valid = false;
        } else {
            setUsernameError("");
        }

        if (!data.password) {
            setPasswordError("Password should not be empty !!!");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (valid) {
            setLoading(true);
            setLoginError("");

            try {
                const response = await axios.post('/api/users/login', data);

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    router.push(`/profile?message=Logged in successfully`);
                }

            } catch (error) {
                const status = error.response?.status;

                if (status === 401) {
                    setLoginError("Invalid Username/Password !!!");
                    setData(defaultData);
                    setForgetpass(true);
                } else {
                    setLoginError("An error occurred. Please try again later.");
                }
                setShowErrorAlert(true);

                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const showPass = () => {
        setSeepass(seepass === 'password' ? 'text' : 'password');
    };

    if (isLoggedIn || isForgot) {
        return (
            <main className={styles.main}>
                <Loader />
            </main>
        );
    }

    return (
        <main className={styles.main}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {['error', 'success', 'warning'].map((type, index) => {
                        const showAlert =
                            (type === 'error' && showErrorAlert) ||
                            (type === 'success' && showSuccessAlert) ||
                            (type === 'warning' && showWarningAlert);
                        const messageContent =
                            (type === 'error' && loginError) ||
                            (type === 'success' && message) ||
                            (type === 'warning' && delmessage) ||
                            (type === 'success' && passmessage);

                        return (
                            <Fade key={index} in={showAlert} timeout={600}>
                                <div className={styles.alertContainer}>
                                    <Alert
                                        severity={type}
                                        className={styles.alert}
                                        sx={{ opacity: alertFadeOut ? 0 : 1, transition: 'opacity 0.6s ease-out' }}
                                    >
                                        {messageContent}
                                    </Alert>
                                </div>
                            </Fade>
                        );
                    })}
                    <div className={styles.container}>
                        <form>
                            <h1 className={bungee_spice.className} style={{ fontSize: '35px' }}>LOGIN</h1>
                            <CssTextField
                                label="Username"
                                name="username"
                                spellCheck="false"
                                autoComplete="off"
                                className={styles.txtfield}
                                value={data.username}
                                onChange={onValueChange}
                                fullWidth
                                sx={{ marginBottom: '14px', marginTop: '14px', minWidth: '100px'}}
                            />
                            {usernameError && <p className={styles.error}>{usernameError}</p>}
                            <CssTextField
                                label="Password"
                                type={seepass}
                                name="password"
                                spellCheck="false"
                                autoComplete="off"
                                className={styles.txtfield}
                                value={data.password}
                                onChange={onValueChange}
                                fullWidth
                                sx={{ marginBottom: '14px', marginTop: '14px', minWidth: '100px' }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                onClick={showPass}
                                                size="small"
                                                sx={{
                                                    minWidth: '0', padding: '4px', color: 'blue', padding: '10px',
                                                    marginTop: '10px', marginBottom: '10px'
                                                }}
                                            >
                                                {seepass === 'password' ? 'Show' : 'Hide'}
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {passwordError && <p className={styles.error}>{passwordError}</p>}
                            <Button
                                variant="contained"
                                className={styles.btn}
                                onClick={(e) => onLogin(e)}
                                fullWidth
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
                                Login
                            </Button>
                            <p style={{ textAlign: 'center' }}>
                                Don't have an account?
                                <a
                                    href="/register"
                                    style={{
                                        textDecoration: isRegisterHovered ? 'underline' : 'none',
                                        color: 'blue',
                                        marginLeft: '5px'
                                    }}
                                    onMouseEnter={() => setIsRegisterHovered(true)}
                                    onMouseLeave={() => setIsRegisterHovered(false)}
                                >
                                    Register
                                </a>
                            </p>
                            {
                                forgetpass && (
                                    <p style={{ textAlign: 'center', fontSize: '17px' }}>
                                        Forgot your Password?
                                        <a
                                            href="#"
                                            onClick={(e)=> {
                                                e.preventDefault();
                                                handleForgotPasswordClick();
                                            }}
                                            style={{
                                                textDecoration: isForgetPassHovered ? 'underline' : 'none',
                                                color: 'blue',
                                                marginLeft: '5px'
                                            }}
                                            onMouseEnter={() => setIsForgetPassHovered(true)}
                                            onMouseLeave={() => setIsForgetPassHovered(false)}
                                        >
                                            Reset
                                        </a>
                                    </p>
                                )
                            }
                        </form>
                    </div>
                </>
            )}
        </main>
    );
}