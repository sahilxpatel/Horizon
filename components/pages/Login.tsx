'use client';

import React, { useState, useContext } from 'react'
import Image from 'next/image'
import { Container, Row, Col, Form, FormGroup, Button, Alert } from 'reactstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import loginImg from '../../assets/images/login.png'
import userIcon from '../../assets/images/user.png'
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import { getImageSrc } from '../../lib/image';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { dispatch, loading } = useContext(AuthContext);
  const router = useRouter();

  const handleChange = e => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async e => {
    e.preventDefault();
    setError(null);
    dispatch({ type: 'LOGIN_START' });

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const result = await res.json();

      if (!res.ok) {
        const message = result.message || 'Unable to login, please try again';
        setError(message);
        return dispatch({ type: 'LOGIN_FAILURE', payload: message });
      }

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: result.data,
        meta: { token: result.token },
      });
      router.push('/');
    } catch (err) {
      const message = err.message || 'Something went wrong';
      setError(message);
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
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
                <Image src={getImageSrc(loginImg)} alt='Travel the world' width={400} height={400} priority />
                <div className="login__img__overlay">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Welcome Back! 👋
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Your next adventure awaits
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
                  <Image src={getImageSrc(userIcon)} alt="User" width={80} height={80} />
                </motion.div>

                <h2>Login</h2>
                <p className="subtitle">Sign in to continue your journey</p>

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

                <Form onSubmit={handleClick}>
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
                        placeholder="Enter your password"
                        required
                        id="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="modern-input"
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
                  </FormGroup>

                  <div className="form-options d-flex justify-content-between align-items-center">
                    <FormGroup check className="remember-me">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="rememberMe">Remember me</label>
                    </FormGroup>
                    <Link href="/forgot-password" className="forgot-link">
                      Forgot password?
                    </Link>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="btn auth__btn" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Login <i className="ri-login-box-line"></i>
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
                    <i className="ri-google-fill"></i> Continue with Google
                  </motion.button>
                </div>

                <p className="switch__auth">
                  Don&apos;t have an account?{' '}
                  <Link href='/register'>Create one now!</Link>
                </p>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Login
