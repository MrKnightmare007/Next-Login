'use client'
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import styles from '@/app/register/register.module.css'
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loader from '../components/loader.js';
import { Bungee_Spice } from 'next/font/google';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';

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

const defaultData = { name: "", email: "", username: "", password: "" };

export default function Register() {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [data, setData] = useState(defaultData);
    const [seepass, setSeepass] = useState("password");
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [sameusernameError, setSameUsernameError] = useState("");
    const [sameemailError, setSameEmailError] = useState("");
    const [showUsernameErrorAlert, setShowUsernameErrorAlert] = useState(false);
    const [showEmailErrorAlert, setShowEmailErrorAlert] = useState(false);
    const [alertFadeOut, setAlertFadeOut] = useState(false);

    useEffect(() => {
        if (showUsernameErrorAlert) {
            const timer = setTimeout(() => {
                setAlertFadeOut(true);
                const clearTimer = setTimeout(() => {
                    setAlertFadeOut(false);
                }, 600);
                setShowUsernameErrorAlert(false);
                return () => clearTimeout(clearTimer);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showUsernameErrorAlert]);

    useEffect(() => {
        if (showEmailErrorAlert) {
            const timer = setTimeout(() => {
                setAlertFadeOut(true);
                const clearTimer = setTimeout(() => {
                    setAlertFadeOut(false);
                }, 600);
                setShowEmailErrorAlert(false);
                return () => clearTimeout(clearTimer);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showEmailErrorAlert]);

    const onValueChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });

        if (e.target.name === "name") setNameError("");
        if (e.target.name === "email") setEmailError("");
        if (e.target.name === "username") setUsernameError("");
        if (e.target.name === "password") validatePassword(e.target.value);
    };

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

    const onRegister = async (e) => {
        e.preventDefault();

        let valid = true;

        if (!data.name) {
            setNameError("Name should not be empty !!!");
            valid = false;
        }

        if (!data.email) {
            setEmailError("Email should not be empty !!!");
            valid = false;
        }

        if (!data.username) {
            setUsernameError("Username should not be empty !!!");
            valid = false;
        }

        if (!data.password) {
            setPasswordError("Password should not be empty !!!");
            valid = false;
        } else if (passwordError) {
            valid = false;
        }

        if (!valid) return;
        setLoading(true);
        //API CALL
        try {
            const response = await axios.post('/api/users/register', data);
            setData(defaultData);

            if (response.status === 200) {
                setIsRegistered(true);
                router.push(`/login?message=User registered successfully`);
            }
        } catch (error) {
            const status = error.response?.status;

            if (status === 401) {
                if (error.response?.data === "Username already exists") {
                    setSameUsernameError("Username already exists !!!");
                    setShowUsernameErrorAlert(true);
                } else if (error.response?.data === "Email already exists") {
                    setSameEmailError("Email already exists !!!");
                    setShowEmailErrorAlert(true);
                }
            }
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const showPass = () => {
        setSeepass(seepass === "password" ? "text" : "password");
    };

    if(isRegistered) {
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
                    <Fade in={showUsernameErrorAlert} timeout={600}>
                        <div className={styles.alertContainer}>
                            <Alert 
                                severity='error' 
                                className={styles.alert}
                                sx={{ opacity: alertFadeOut ? 0 : 1, transition: 'opacity 0.6s ease-out' }}
                            >
                                {sameusernameError}
                            </Alert>
                        </div>
                    </Fade>
                    <Fade in={showEmailErrorAlert} timeout={600}>
                        <div className={styles.alertContainer}>
                            <Alert 
                                severity='error' 
                                className={styles.alert}
                                sx={{ opacity: alertFadeOut ? 0 : 1, transition: 'opacity 0.6s ease-out' }}
                            >
                                {sameemailError}
                            </Alert>
                        </div>
                    </Fade>
                    <div className={styles.container}>
                        <form>
                            <h1 className={bungee_spice.className} style={{ textAlign: 'center', fontSize: '35px' }}>REGISTER</h1>
                            <CssTextField
                                label="Name"
                                name="name"
                                spellCheck="false"
                                autoComplete="off"
                                className={styles.txtfield}
                                sx={{ marginBottom: '10px', minWidth: '100px' }}
                                value={data.name}
                                onChange={onValueChange}
                                fullWidth
                            />
                            {nameError && <p className={styles.error}>{nameError}</p>}

                            <CssTextField
                                label="Email-ID"
                                name="email"
                                spellCheck="false"
                                autoComplete="off"
                                className={styles.txtfield}
                                sx={{ marginBottom: '10px', minWidth: '100px' }}
                                value={data.email}
                                onChange={onValueChange}
                                fullWidth
                            />
                            {emailError && <p className={styles.error}>{emailError}</p>}

                            <CssTextField
                                label="Username"
                                name="username"
                                spellCheck="false"
                                autoComplete="off"
                                className={styles.txtfield}
                                sx={{ marginBottom: '10px', minWidth: '100px' }}
                                value={data.username}
                                onChange={onValueChange}
                                fullWidth
                            />
                            {usernameError && <p className={styles.error}>{usernameError}</p>}
                            <CssTextField
                                label="Password"
                                type={seepass}
                                name="password"
                                spellCheck="false"
                                autoComplete="current-password"
                                className={styles.txtfield}
                                sx={{ marginBottom: '10px', minWidth: '100px' }}
                                value={data.password}
                                onChange={onValueChange}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                onClick={showPass}
                                                size="small"
                                                style={{ minWidth: '0', padding: '4px', color: 'blue' }}
                                            >
                                                {seepass === "password" ? "Show" : "Hide"}
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
                            <Button
                                variant="contained"
                                className={styles.btn}
                                onClick={onRegister}
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
                                Register
                            </Button>
                            <p style={{ textAlign: 'center' }}>
                                Already have an account?
                                <a
                                    href="/login"
                                    style={{
                                        textDecoration: isHovered ? 'underline' : 'none',
                                        color: 'blue',
                                        marginLeft: '5px'
                                    }}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    Login
                                </a>
                            </p>
                        </form>
                    </div>
                </>
            )}
        </main>
    );
}
