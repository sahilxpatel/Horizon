'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ShareButtons = ({ url, title, description }) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareText = description || 'Check out this amazing tour!';
  const message = `${shareTitle} – ${shareText}`.trim();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: 'ri-whatsapp-line',
      color: '#25D366',
  url: `https://wa.me/?text=${encodeURIComponent(`${message} ${shareUrl}`)}`,
    },
    {
      name: 'Facebook',
      icon: 'ri-facebook-fill',
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Twitter',
      icon: 'ri-twitter-x-fill',
      color: '#000000',
  url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`,
    },
    {
      name: 'LinkedIn',
      icon: 'ri-linkedin-fill',
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Telegram',
      icon: 'ri-telegram-fill',
      color: '#0088cc',
  url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`,
    },
  ];

  const handleShare = (link) => {
    window.open(link, '_blank', 'width=600,height=400');
  };

  return (
    <div className="share__buttons__wrapper">
      <motion.button
        className="share__toggle__btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <i className="ri-share-line"></i>
        <span>Share Tour</span>
      </motion.button>

      {isOpen && (
        <motion.div
          className="share__buttons__container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="share__buttons__grid">
            {shareLinks.map((link, index) => (
              <motion.button
                key={link.name}
                className="share__btn"
                style={{ '--share-color': link.color }}
                onClick={() => handleShare(link.url)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className={link.icon}></i>
                <span>{link.name}</span>
              </motion.button>
            ))}

            <motion.button
              className={`share__btn copy__btn ${copied ? 'copied' : ''}`}
              onClick={handleCopyLink}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: shareLinks.length * 0.05 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={copied ? 'ri-check-line' : 'ri-file-copy-line'}></i>
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ShareButtons;

