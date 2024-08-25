'use client';
import { Suspense, useEffect, useState } from 'react';
import { NoSsr } from '@mui/material';
import styles from './resetpassword.module.css';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { Bungee_Spice } from 'next/font/google';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter, useSearchParams } from 'next/navigation';
import Fade from '@mui/material/Fade';
import Loader from '../components/loader';
import { getCookie, deleteCookie } from 'cookies-next';

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

const defaultData = { password: "", newpassword: "" };

export default function Resetpassword() {
    return (
        <Suspense fallback={<Loader />}>
            <ResetpasswordContent />
        </Suspense>
    );
}

function ResetpasswordContent() {
    const router = useRouter();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [username, setUsername] = useState('');
    const [alertFadeOut, setAlertFadeOut] = useState(false);
    const [data, setData] = useState(defaultData);
    const [passwordError, setPasswordError] = useState("");
    const [newpasswordError, setNewPasswordError] = useState("");
    const [seepass, setSeepass] = useState('password');
    const [loading, setLoading] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [seenewpass, setSeeNewpass] = useState('password');
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    useEffect(() => {
        const resetToken = getCookie('passwordResetToken');
        if (!resetToken) {
            router.push('/login');
        }
    }, [router]);

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
    }, [message, router]);

    useEffect(() => {
        const storedUsername = localStorage.getItem('forgotPasswordUsername');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const onValueChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });

        if (e.target.name === "password") setPasswordError("");
        if (e.target.name === "newpassword") setNewPasswordError("");
        if (e.target.name === "password") validatePassword(e.target.value);
    }

    const validatePassword = (value) => {
        const conditions = {
            hasLowerCase: /[a-z]/.test(value),
            hasUpperCase: /[A-Z]/.test(value),
            hasNumber: /[0-9]/.test(value),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value),
            isValidLength: value.length >= 8 && value.length <= 16,
        };

        const errors = [
            { condition: conditions.hasLowerCase, message: "At least 1 lowercase character." },
            { condition: conditions.hasUpperCase, message: "At least 1 uppercase character." },
            { condition: conditions.hasNumber, message: "At least 1 number." },
            { condition: conditions.hasSpecial, message: "At least 1 special character." },
            { condition: conditions.isValidLength, message: "Min: 8 characters, Max: 16 characters." }
        ];

        const errorMessages = errors.filter(error => !error.condition).map(error => error.message);

        setPasswordError(errorMessages.join(" "));

        if (errorMessages.length === 0) {
            setPasswordError("");
        }
    };

    const handleSubmit = async (username, password, newpassword) => {
        setLoading(true);
        let valid = true;
        if (!password) {
            setPasswordError("Password should not be empty !!!");
            valid = false;
        }
        if (!newpassword) {
            setNewPasswordError("New Password should not be empty !!!");
            valid = false;
        }
        if (password !== newpassword) {
            setNewPasswordError("Passwords do not match !!!");
            valid = false;
        }
        else if (passwordError) {
            valid = false;
        }
        if (valid) {
            try {
                const response = await fetch('/api/users/resetpassword', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, newpassword: data.newpassword }),
                });

                if (response.status === 200) {
                    deleteCookie('passwordResetToken');
                    deleteCookie('passwordResestStage');
                    setIsReset(true);
                    router.push(`/login?passmessage=Password changed successfully`);
                } else {
                    const errorMessage = await response.text();
                    alert(`Error: ${errorMessage}`);
                }
            } catch (error) {
                console.error("An error occurred:", error);
                alert("An error occurred while resetting the password.");
            } finally {
                setLoading(false);
            }
        }
    };

    const showPass = () => {
        setSeepass(seepass === 'password' ? 'text' : 'password');
    };

    const showNewPass = () => {
        setSeeNewpass(seenewpass === 'password' ? 'text' : 'password');
    };

    if (isReset) {
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
                        <Fade in={showSuccessAlert} timeout={600}>
                            <div className={styles.alertContainer}>
                                <Alert
                                    severity='success'
                                    sx={{ opacity: alertFadeOut ? 0 : 1, transition: 'opacity 0.6s ease-out' }}
                                >
                                    {message}
                                </Alert>
                            </div>
                        </Fade>
                        <div className={styles.container}>
                            <form>
                                <h1 className={bungee_spice.className}>Reset Password</h1>
                                <CssTextField
                                    label="New Password"
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
                                {passwordError && (
                                    <ul className={styles.passwordRequirements}>
                                        <li style={{ color: /[a-z]/.test(data.password) ? 'green' : 'red' }}>At least 1 lowercase character.</li>
                                        <li style={{ color: /[A-Z]/.test(data.password) ? 'green' : 'red' }}>At least 1 uppercase character.</li>
                                        <li style={{ color: /[0-9]/.test(data.password) ? 'green' : 'red' }}>At least 1 number.</li>
                                        <li style={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(data.password) ? 'green' : 'red' }}>At least 1 special character.</li>
                                        <li style={{ color: data.password.length >= 8 && data.password.length <= 16 ? 'green' : 'red' }}>Min: 8 characters, Max: 16 characters.</li>
                                    </ul>
                                )}
                                <CssTextField
                                    label="Confirm New Password"
                                    type={seenewpass}
                                    name="newpassword"
                                    spellCheck="false"
                                    autoComplete="off"
                                    className={styles.txtfield}
                                    value={data.newpassword}
                                    onChange={onValueChange}
                                    fullWidth
                                    sx={{ marginBottom: '14px', marginTop: '14px', minWidth: '100px' }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    onClick={showNewPass}
                                                    size="small"
                                                    sx={{
                                                        minWidth: '0', padding: '4px', color: 'blue', padding: '10px',
                                                        marginTop: '10px', marginBottom: '10px'
                                                    }}
                                                >
                                                    {seenewpass === 'password' ? 'Show' : 'Hide'}
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {newpasswordError && <p style={{ color: 'red' }}>{newpasswordError}</p>}
                                <Button
                                    variant="contained"
                                    className={styles.btn}
                                    onClick={() => handleSubmit(username, data.password, data.newpassword)}
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#ed1111',
                                        color: 'white',
                                        '&:hover': { backgroundColor: '#ed1111', color: 'white' }
                                    }}
                                >
                                    RESET PASSWORD
                                </Button>
                            </form>
                        </div>
                    </>
                )}
            </main>
        </NoSsr>
    );
}
