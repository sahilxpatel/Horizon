'use client';

import React from 'react'
import Header from './../Header/Header'
import Footer from './../Footer/Footer'
import FloatingActionButton from '../Common/FloatingActionButton'
import ComparisonBar from '../Comparison/ComparisonBar'

const Layout = ({ children }) => {
  return (
    <>
     <a href="#main-content" className='skip-link'>Skip to main content</a>
     <Header/>
     <main id='main-content'>
       {children}
     </main>
  <Footer />
  <ComparisonBar />
     <FloatingActionButton />
    </>
  )
}

export default Layout

