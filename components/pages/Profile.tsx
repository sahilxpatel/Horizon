'use client';

import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Button, Form, FormGroup, Alert } from 'reactstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const { user, dispatch } = useContext(AuthContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const userId = user?.id || user?._id;
  
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const fetchBookings = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/bookings/user/${userId}`, {
        credentials: 'include'
      });
      const result = await res.json();
      
      if (res.ok) {
        setBookings(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch user bookings
  useEffect(() => {
    if (activeTab === 'bookings' && user) {
      fetchBookings();
    }
  }, [activeTab, fetchBookings, user]);

  const handleInputChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      });

      const result = await res.json();

      if (res.ok) {
        dispatch({ type: 'UPDATE_USER', payload: result.data });
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditMode(false);
      } else {
        setMessage({ type: 'danger', text: result.message || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    router.push('/');
  };

  if (!user) {
    return null;
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <section className="profile__section">
      <Container>
        <motion.div
          className="profile__header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile__avatar">
            <div className="avatar__circle">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="avatar__badge">
              <i className="ri-check-line"></i>
            </div>
          </div>
          <div className="profile__info">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <div className="profile__stats">
              <div className="stat__item">
                <i className="ri-map-pin-line"></i>
                <span>{bookings.length} Tours Booked</span>
              </div>
              <div className="stat__item">
                <i className="ri-calendar-line"></i>
                <span>Member since {new Date(user.createdAt || Date.now()).getFullYear()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <Row className="mt-5">
          <Col lg="3" md="4">
            <motion.div
              className="profile__sidebar"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Nav vertical className="profile__nav">
                <NavItem>
                  <NavLink
                    className={activeTab === 'profile' ? 'active' : ''}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="ri-user-line"></i>
                    <span>Profile</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === 'bookings' ? 'active' : ''}
                    onClick={() => setActiveTab('bookings')}
                  >
                    <i className="ri-bookmark-line"></i>
                    <span>My Bookings</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === 'settings' ? 'active' : ''}
                    onClick={() => setActiveTab('settings')}
                  >
                    <i className="ri-settings-line"></i>
                    <span>Settings</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={handleLogout} className="logout__link">
                    <i className="ri-logout-box-line"></i>
                    <span>Logout</span>
                  </NavLink>
                </NavItem>
              </Nav>
            </motion.div>
          </Col>

          <Col lg="9" md="8">
            <motion.div
              className="profile__content"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TabContent activeTab={activeTab}>
                {/* Profile Tab */}
                <TabPane tabId="profile">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="profile"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <div className="content__header">
                        <h3><i className="ri-user-line"></i> Profile Information</h3>
                        {!editMode && (
                          <Button
                            color="primary"
                            className="edit__btn"
                            onClick={() => setEditMode(true)}
                          >
                            <i className="ri-edit-line"></i> Edit Profile
                          </Button>
                        )}
                      </div>

                      {message.text && (
                        <Alert color={message.type} className="mt-3">
                          {message.text}
                        </Alert>
                      )}

                      <Form onSubmit={handleUpdateProfile}>
                        <Row>
                          <Col md="6">
                            <FormGroup>
                              <label>
                                <i className="ri-user-line"></i> Username
                              </label>
                              <input
                                type="text"
                                name="username"
                                value={profileData.username}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                className="profile__input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <label>
                                <i className="ri-mail-line"></i> Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                className="profile__input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <label>
                                <i className="ri-phone-line"></i> Phone
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                className="profile__input"
                                placeholder="Add your phone number"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup>
                              <label>
                                <i className="ri-file-text-line"></i> Bio
                              </label>
                              <textarea
                                name="bio"
                                value={profileData.bio}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                className="profile__input"
                                rows="4"
                                placeholder="Tell us about yourself"
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        {editMode && (
                          <div className="form__actions">
                            <Button
                              type="submit"
                              color="primary"
                              disabled={loading}
                            >
                              {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                              type="button"
                              color="secondary"
                              onClick={() => {
                                setEditMode(false);
                                setProfileData({
                                  username: user?.username || '',
                                  email: user?.email || '',
                                  phone: user?.phone || '',
                                  bio: user?.bio || ''
                                });
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </Form>
                    </motion.div>
                  </AnimatePresence>
                </TabPane>

                {/* Bookings Tab */}
                <TabPane tabId="bookings">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="bookings"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <div className="content__header">
                        <h3><i className="ri-bookmark-line"></i> My Bookings</h3>
                      </div>

                      {loading ? (
                        <div className="loading__state">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p>Loading your bookings...</p>
                        </div>
                      ) : bookings.length === 0 ? (
                        <div className="empty__state">
                          <i className="ri-bookmark-line"></i>
                          <h4>No bookings yet</h4>
                          <p>Start exploring and book your first adventure!</p>
                          <Button color="primary" onClick={() => router.push('/tours')}>
                            Browse Tours
                          </Button>
                        </div>
                      ) : (
                        <div className="bookings__list">
                          {bookings.map((booking, index) => (
                            <motion.div
                              key={booking.id || booking._id}
                              className="booking__card"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="booking__info">
                                <h5>{booking.tourName}</h5>
                                <div className="booking__details">
                                  <span>
                                    <i className="ri-calendar-line"></i>
                                    {new Date(booking.bookAt).toLocaleDateString()}
                                  </span>
                                  <span>
                                    <i className="ri-group-line"></i>
                                    {booking.guestSize} guests
                                  </span>
                                  <span>
                                    <i className="ri-money-dollar-circle-line"></i>
                                    ₹{booking.amount?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className={`booking__status ${booking.paymentStatus}`}>
                                {booking.paymentStatus === 'paid' ? (
                                  <>
                                    <i className="ri-checkbox-circle-fill"></i>
                                    Confirmed
                                  </>
                                ) : (
                                  <>
                                    <i className="ri-time-line"></i>
                                    Pending
                                  </>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </TabPane>

                {/* Settings Tab */}
                <TabPane tabId="settings">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="settings"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <div className="content__header">
                        <h3><i className="ri-settings-line"></i> Account Settings</h3>
                      </div>

                      <div className="settings__section">
                        <h5>Privacy & Security</h5>
                        <div className="settings__item">
                          <div>
                            <h6>Change Password</h6>
                            <p>Update your password to keep your account secure</p>
                          </div>
                          <Button color="primary" outline>
                            Change Password
                          </Button>
                        </div>
                        <div className="settings__item">
                          <div>
                            <h6>Two-Factor Authentication</h6>
                            <p>Add an extra layer of security to your account</p>
                          </div>
                          <Button color="primary" outline>
                            Enable 2FA
                          </Button>
                        </div>
                      </div>

                      <div className="settings__section">
                        <h5>Notifications</h5>
                        <div className="settings__item">
                          <div>
                            <h6>Email Notifications</h6>
                            <p>Receive updates about your bookings</p>
                          </div>
                          <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                          </label>
                        </div>
                        <div className="settings__item">
                          <div>
                            <h6>Marketing Emails</h6>
                            <p>Get the latest deals and offers</p>
                          </div>
                          <label className="switch">
                            <input type="checkbox" />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>

                      <div className="settings__section danger__zone">
                        <h5>Danger Zone</h5>
                        <div className="settings__item">
                          <div>
                            <h6>Delete Account</h6>
                            <p>Permanently delete your account and all data</p>
                          </div>
                          <Button color="danger" outline>
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </TabPane>
              </TabContent>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Profile;

