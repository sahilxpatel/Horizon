'use client';

import React, { useRef, useEffect, useContext, useState } from 'react'
// import { Container, Row, Button, ButtonDropdown } from 'reactstrap'
import { Container, Row, Button } from 'reactstrap'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
// import logo from '../../assets/images/logo.png'
import logo from '../../assets/images/horizon.png'
import { AuthContext } from '../../context/AuthContext'
import GlobalTextSearch from '../Search/GlobalTextSearch'
import { useTheme } from '../../context/ThemeContext'

const nav_links = [
  {
    path: '/',
    display: 'Home',
  },
  // {
  //   path: '/about',
  //   display: 'About',
  // },
  {
    path: '/gallery',
    display: 'Gallery',
  },
  {
    path: '/tours',
    display: 'Tours',
  },
  {
    path: '/contact',
    display: 'Contact',
  },
]


const Header = () => {
  const headerRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()
  const { user, dispatch } = useContext(AuthContext)
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    closeMenu()
    router.push('/')
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return
      if (window.scrollY > 80) {
        headerRef.current.classList.add('sticky__header')
      } else {
        headerRef.current.classList.remove('sticky__header')
      }
    }

    const handleResize = () => {
      const desktop = window.innerWidth >= 992
      setIsDesktop(desktop)
      if (desktop) {
        closeMenu()
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    handleResize()
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <motion.header 
      className='header' 
      ref={headerRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Container>
        <Row className='align-items-center'>
          <div className='nav_wrapper d-flex align-items-center justify-content-between'>
            <motion.div 
              className='logo'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href='/' onClick={closeMenu} aria-label='Horizon home'>
                <Image src={typeof logo === 'string' ? logo : logo?.src || '/logo.png'} alt='Horizon logo' width={150} height={45} priority />
              </Link>
            </motion.div>

            <AnimatePresence>
              {(menuOpen || isDesktop) && (
                <motion.nav 
                  className={`navigation ${menuOpen ? 'is-active' : ''}`} 
                  aria-label='Primary navigation'
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <ul className={`menu d-flex align-items-center ${menuOpen ? 'menu--active' : ''}`}>
                    {nav_links.map((item, index) => (
                      <motion.li 
                        className='nav__item' 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.path}
                          className={`nav__link ${pathname === item.path ? 'active__link' : ''}`}
                          onClick={closeMenu}
                        >
                          {item.display}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div 
                    className='menu__cta d-lg-none'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {user ? (
                      <>
                        <span className='nav__user'>Hi, {user.username}</span>
                        <Link href='/profile' className='btn primary__btn w-100 mb-2' onClick={closeMenu}>
                          <i className='ri-user-line'></i> My Profile
                        </Link>
                        <Button color='dark' className='logout__btn w-100' onClick={logout}>
                          Logout
                        </Button>
                      </>
                    ) : (
                      <div className='menu__auth'>
                        <Link href='/login' className='btn secondary__btn w-100' onClick={closeMenu}>
                          Login
                        </Link>
                        <Link href='/register' className='btn primary__btn w-100' onClick={closeMenu}>
                          Register
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </motion.nav>
              )}
            </AnimatePresence>

            <div className='nav_right d-flex align-items-center gap-4'>
              <div className='d-none d-lg-block' style={{ minWidth: '240px' }}>
                <GlobalTextSearch />
              </div>
              <div className='nav__btns d-none d-lg-flex align-items-center gap-3'>
                <motion.button 
                  type='button'
                  onClick={toggleTheme}
                  className='btn theme__toggle'
                  title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                  aria-label={theme === 'light' ? 'Activate dark theme' : 'Activate light theme'}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={theme === 'light' ? 'ri-moon-line' : 'ri-sun-line'}></i>
                </motion.button>
                {user ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href='/wishlist' className='btn wishlist__header__btn' onClick={closeMenu} title="My Wishlist">
                        <i className='ri-heart-line'></i>
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href='/profile' className='btn profile__btn' onClick={closeMenu}>
                        <i className='ri-user-line'></i>
                        <span className='d-none d-xl-inline'>{user.username}</span>
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button color='dark' className='logout__btn' onClick={logout}>
                        Logout
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href='/login' className='btn secondary__btn' onClick={closeMenu}>
                        Login
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href='/register' className='btn primary__btn' onClick={closeMenu}>
                        Register
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>

              <motion.button
                type='button'
                className={`mobile__menu d-lg-none ${menuOpen ? 'is-open' : ''}`}
                onClick={toggleMenu}
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={menuOpen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.i 
                  className={menuOpen ? 'ri-close-line' : 'ri-menu-line'}
                  animate={{ rotate: menuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                ></motion.i>
              </motion.button>
            </div>
          </div>
        </Row>
      </Container>
      <AnimatePresence>
        {menuOpen && (
          <motion.span 
            className='nav__overlay show' 
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header

