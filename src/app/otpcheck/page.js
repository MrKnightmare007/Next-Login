'use client'
import { useState, useEffect } from 'react';
import styles from './otpcheck.module.css';
import { NoSsr } from '@mui/material';
import { Bungee_Spice } from 'next/font/google';
import * as React from 'react';
import PropTypes from 'prop-types';
import { Input as BaseInput } from '@mui/base/Input';
import { Box, styled } from '@mui/system';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Loader from '../components/loader';
import { getCookie, setCookie } from 'cookies-next';

const red = {
    500: '#ff0000',
    700: '#cc0000',
    900: '#990000',
};

const InputElement = styled('input')(
    ({ theme }) => `
    width: 100%;
    min-width: 32px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 0px;
    border-radius: 8px;
    text-align: center;
    color: ${theme.palette.mode === 'dark' ? red[500] : red[900]};
    background: ${theme.palette.mode === 'dark' ? red[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? red[700] : red[200]};
  
    &:hover {
      border-color: ${red[700]};
    }
  
    &:focus {
      border-color: ${red[900]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? red[900] : red[700]};
    }
  
    &:focus-visible {
      outline: 0;
    }
  `,
);

const bungee_spice = Bungee_Spice({
    weight: "400",
    display: "swap",
    subsets: ['latin'],
});

function OTP({ separator, length, value, onChange }) {
    const inputRefs = React.useRef(new Array(length).fill(null));

    const focusInput = (targetIndex) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput.focus();
    };

    const selectInput = (targetIndex) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput.select();
    };

    const handleKeyDown = (event, currentIndex) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case ' ':
                event.preventDefault();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex < length - 1) {
                    focusInput(currentIndex + 1);
                    selectInput(currentIndex + 1);
                }
                break;
            case 'Delete':
                event.preventDefault();
                onChange((prevOtp) => {
                    const otp =
                        prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
                    return otp;
                });

                break;
            case 'Backspace':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }

                onChange((prevOtp) => {
                    const otp =
                        prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
                    return otp;
                });
                break;

            default:
                break;
        }
    };

    const handleChange = (event, currentIndex) => {
        const currentValue = event.target.value;
        let indexToEnter = 0;

        while (indexToEnter <= currentIndex) {
            if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
                indexToEnter += 1;
            } else {
                break;
            }
        }
        onChange((prev) => {
            const otpArray = prev.split('');
            const lastValue = currentValue[currentValue.length - 1];
            otpArray[indexToEnter] = lastValue;
            return otpArray.join('');
        });
        if (currentValue !== '') {
            if (currentIndex < length - 1) {
                focusInput(currentIndex + 1);
            }
        }
    };

    const handleClick = (event, currentIndex) => {
        selectInput(currentIndex);
    };

    const handlePaste = (event, currentIndex) => {
        event.preventDefault();
        const clipboardData = event.clipboardData;

        if (clipboardData.types.includes('text/plain')) {
            let pastedText = clipboardData.getData('text/plain');
            pastedText = pastedText.substring(0, length).trim();
            let indexToEnter = 0;

            while (indexToEnter <= currentIndex) {
                if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
                    indexToEnter += 1;
                } else {
                    break;
                }
            }

            const otpArray = value.split('');

            for (let i = indexToEnter; i < length; i += 1) {
                const lastValue = pastedText[i - indexToEnter] ?? ' ';
                otpArray[i] = lastValue;
            }

            onChange(otpArray.join(''));
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {new Array(length).fill(null).map((_, index) => (
                <React.Fragment key={index}>
                    <BaseInput
                        slots={{
                            input: InputElement,
                        }}
                        aria-label={`Digit ${index + 1} of OTP`}
                        slotProps={{
                            input: {
                                ref: (ele) => {
                                    inputRefs.current[index] = ele;
                                },
                                onKeyDown: (event) => handleKeyDown(event, index),
                                onChange: (event) => handleChange(event, index),
                                onClick: (event) => handleClick(event, index),
                                onPaste: (event) => handlePaste(event, index),
                                value: value[index] ?? '',
                            },
                        }}
                    />
                    {index === length - 1 ? null : separator}
                </React.Fragment>
            ))}
        </Box>
    );
}

OTP.propTypes = {
    length: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    separator: PropTypes.node,
    value: PropTypes.string.isRequired,
};
export default function Otpcheck() {
    const [otp, setOtp] = useState('');
    const [username, setUsername] = useState(''); // Replace with actual username or fetch dynamically
    const [email, setEmail] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [SuccessAlert, setSuccessAlert] = useState(false);
    const [alertFadeOut, setAlertFadeOut] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [erroralert, setErrorAlert] = useState("");
    const [showOTPAlert, setShowOTPAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const resetToken = getCookie('passwordResetToken');
        if (!resetToken) {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        const storedUsername = localStorage.getItem('forgotPasswordUsername');
        const storedEmail = localStorage.getItem('forgotPasswordEmail');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

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

    useEffect(() => {
        if (showOTPAlert) {
            const timer = setTimeout(() => {
                setAlertFadeOut(true);
                const clearTimer = setTimeout(() => {
                    setAlertFadeOut(false);
                }, 600);
                setShowOTPAlert(false);
                return () => clearTimeout(clearTimer);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showOTPAlert]);

    async function handleSubmit(otp, username) {
        setLoading(true);
        try {
            const response = await fetch('/api/users/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsVerified(true);

                // Update the passwordResetStage cookie to 'stage2'
                setCookie('passwordResetStage', 'stage2', { path: '/' });

                router.push(`/resetpassword?message=OTP verified successfully`);
            } else {
                setShowErrorAlert(true);
                setErrorAlert(data.error);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // Utility function to format email
    function formatEmail(email) {
        const [localPart, domain] = email.split('@');
        if (localPart.length <= 3) {
            return `${localPart[0]}***@${domain}`;
        }
        return `${localPart.slice(0, 3)}${'*'.repeat(localPart.length - 3)}@${domain}`;
    }

    // Handler for Resend OTP
    const handleResendOTP = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/users/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });
            if (res.status === 200) {
                const data = await res.json();
                localStorage.setItem('forgotPasswordUsername', username);
                localStorage.setItem('forgotPasswordEmail', data.email);
                setShowOTPAlert(true);
                setSuccessAlert("OTP resent to registered email");

                // Refresh the page
                setOtp("");
            } else if (res.status === 404) {
                setShowErrorAlert(true);
                setErrorAlert("User not found !!!");
            } else {
                setShowErrorAlert(true);
                setErrorAlert("An unexpected error occurred. Please try again later.");
            }
        } catch (error) {
            console.log('Error:', error);
            setShowErrorAlert(true);
            setErrorAlert("Failed to submit request. Please try again !!!");
        }
    };

    if (isVerified) {
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
                                    {erroralert}
                                </Alert>
                            </div>
                        </Fade>
                        <Fade in={showOTPAlert} timeout={600}>
                            <div className={styles.alertContainer}>
                                <Alert
                                    severity="success"
                                    sx={{ opacity: alertFadeOut ? 0 : 1, transition: 'opacity 0.6s ease-out' }}
                                >
                                    {SuccessAlert}
                                </Alert>
                            </div>
                        </Fade>
                        <div className={styles.container}>
                            <h1 className={bungee_spice.className}>Verification</h1>
                            <p>An email has been sent to your registered Email-ID: {formatEmail(email)}</p>
                            <p>Enter the OTP sent to your Email-ID</p>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                <OTP separator={<span>-</span>} value={otp} onChange={setOtp} length={6} />
                            </Box>
                            <Button
                                variant="contained"
                                className={styles.btn}
                                onClick={() => handleSubmit(otp, username)}
                                fullWidth
                                sx={{
                                    backgroundColor: '#b90b0b',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: 'red',
                                    },
                                    padding: '10px',
                                    marginTop: '15px',
                                }}
                            >
                                Submit OTP
                            </Button>
                            <p style={{ textAlign: 'center' }}>
                                Didn't receive an OTP?
                                <a
                                    href="#"
                                    style={{
                                        textDecoration: isHovered ? 'underline' : 'none',
                                        color: 'blue',
                                        marginLeft: '5px',
                                    }}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onClick={handleResendOTP}  // Call handleResendOTP when clicked
                                >
                                    Resend
                                </a>
                            </p>
                        </div>
                    </>
                )}
            </main>
        </NoSsr>
    );
}
