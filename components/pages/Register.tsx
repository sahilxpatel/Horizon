'use client';

import React, { useState, useContext, useMemo } from 'react'
import { Container, Row, Col, Form, FormGroup, Button, Alert } from 'reactstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import registerImg from '../../assets/images/register.png'
import userIcon from '../../assets/images/user.png'
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import { getImageSrc } from '../../lib/image';

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const router = useRouter();

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    const password = credentials.password;
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#d32f2f', '#f57c00', '#fbc02d', '#689f38', '#388e3c'];

    return {
      strength: (strength / 5) * 100,
      label: labels[Math.min(strength - 1, 4)] || 'Very Weak',
      color: colors[Math.min(strength - 1, 4)] || '#d32f2f'
    };
  }, [credentials.password]);

  const handleChange = e => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async e => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (credentials.password !== credentials.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (credentials.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    try {
      const payload = {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      };

      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        const message = result.message || 'Unable to register';
        setError(message);
        return;
      }

      dispatch({ type: 'REGISTER_SUCCESS' });
      setSuccessMessage('Account created successfully! Redirecting to login…');
      setTimeout(() => router.push('/login'), 1500);

    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };
  return (
    <section className="auth__section">
      <Container>
        <Row>
          <Col lg='10' xl='8' className="m-auto">
            <motion.div 
              className="login__container d-flex justify-content-between"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="login__img"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img src={getImageSrc(registerImg)} alt='Join our community' />
                <div className="login__img__overlay">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Start Your Journey! 🌍
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Join thousands of travelers worldwide
                  </motion.p>
                </div>
              </motion.div>

              <motion.div 
                className="login__form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div 
                  className="user"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8, delay: 0.4 }}
                >
                  <img src={getImageSrc(userIcon)} alt="User" />
                </motion.div>

                <h2>Create Account</h2>
                <p className="subtitle">Sign up to explore amazing destinations</p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert color="danger" className="mt-2 alert-modern">
                      <i className="ri-error-warning-line"></i>
                      {error}
                    </Alert>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Alert color="success" className="mt-2 alert-modern">
                      <i className="ri-checkbox-circle-line"></i>
                      {successMessage}
                    </Alert>
                  </motion.div>
                )}

                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <label htmlFor="username">
                      <i className="ri-user-line"></i> Username
                    </label>
                    <input
                      type="text"
                      placeholder="Choose a username"
                      required
                      id="username"
                      value={credentials.username}
                      onChange={handleChange}
                      className="modern-input"
                      minLength="3"
                    />
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor="email">
                      <i className="ri-mail-line"></i> Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                      id="email"
                      value={credentials.email}
                      onChange={handleChange}
                      className="modern-input"
                    />
                  </FormGroup>

                  <FormGroup className="password-field">
                    <label htmlFor="password">
                      <i className="ri-lock-line"></i> Password
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        required
                        id="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="modern-input"
                        minLength="6"
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                      </button>
                    </div>
                    {credentials.password && (
                      <motion.div 
                        className="password-strength"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="strength-bar">
                          <motion.div
                            className="strength-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.strength}%` }}
                            style={{ backgroundColor: passwordStrength.color }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <span className="strength-label" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </motion.div>
                    )}
                  </FormGroup>

                  <FormGroup className="password-field">
                    <label htmlFor="confirmPassword">
                      <i className="ri-lock-line"></i> Confirm Password
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        required
                        id="confirmPassword"
                        value={credentials.confirmPassword}
                        onChange={handleChange}
                        className="modern-input"
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword(prev => !prev)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        <i className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                      </button>
                    </div>
                    {credentials.confirmPassword && credentials.password !== credentials.confirmPassword && (
                      <motion.span 
                        className="password-match-error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <i className="ri-close-circle-line"></i> Passwords don't match
                      </motion.span>
                    )}
                    {credentials.confirmPassword && credentials.password === credentials.confirmPassword && (
                      <motion.span 
                        className="password-match-success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <i className="ri-checkbox-circle-line"></i> Passwords match
                      </motion.span>
                    )}
                  </FormGroup>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="btn auth__btn" 
                      type="submit"
                      disabled={successMessage !== null}
                    >
                      {successMessage ? (
                        <>
                          <i className="ri-checkbox-circle-line"></i> Account Created
                        </>
                      ) : (
                        <>
                          Create Account <i className="ri-user-add-line"></i>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </Form>

                <div className="auth__divider">
                  <span>OR</span>
                </div>

                <div className="social__login">
                  <motion.button
                    className="social__btn google"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                  >
                    <i className="ri-google-fill"></i> Sign up with Google
                  </motion.button>
                </div>

                <p className="switch__auth">
                  Already have an account?{' '}
                  <Link href='/login'>Sign in here!</Link>
                </p>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Register

