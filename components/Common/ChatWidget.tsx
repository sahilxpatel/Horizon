'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { QUICK_SUGGESTIONS } from '../../lib/ai/chat-config';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  status?: 'typing' | 'error';
};

const STORAGE_KEY = 'horizon_chat_conversation_v1';

const defaultMessages: ChatMessage[] = [
  {
    id: 'assistant-welcome',
    role: 'assistant',
    content: 'Hi, I can help you find tours, compare options, and understand booking steps. Tell me your budget, destination, or trip length.'
  }
];

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const safeParseMessages = (value: string | null): ChatMessage[] => {
  if (!value) return defaultMessages;

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return defaultMessages;
    return parsed
      .filter((entry) => entry && typeof entry === 'object')
      .map((entry: any) => ({
        id: String(entry.id || makeId()),
        role: entry.role === 'user' || entry.role === 'assistant' || entry.role === 'system' ? entry.role : 'assistant',
        content: String(entry.content || '').slice(0, 4000),
        status: entry.status === 'typing' || entry.status === 'error' ? entry.status : undefined
      }))
      .slice(-24);
  } catch {
    return defaultMessages;
  }
};

const getInitialMessages = () => {
  if (typeof window === 'undefined') {
    return defaultMessages;
  }

  return safeParseMessages(window.localStorage.getItem(STORAGE_KEY));
};

const ChatWidget = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastUserMessageRef = useRef('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    };

    window.addEventListener('horizon:open-chat', handleOpenChat as EventListener);
    return () => window.removeEventListener('horizon:open-chat', handleOpenChat as EventListener);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isOpen, isSending]);

  const clearConversation = () => {
    setMessages(defaultMessages);
    setErrorMessage('');
    setInput('');
    lastUserMessageRef.current = '';
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const sendMessage = async (overrideText?: string) => {
    const text = String(overrideText ?? input).trim();
    if (!text || isSending) return;

    const userMessage: ChatMessage = { id: makeId(), role: 'user', content: text };
    const typingMessage: ChatMessage = { id: makeId(), role: 'assistant', content: 'Typing…', status: 'typing' };

    lastUserMessageRef.current = text;
    setInput('');
    setErrorMessage('');
    setMessages((current) => [...current, userMessage, typingMessage]);
    setIsSending(true);

    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
            .filter((message) => message.role !== 'system')
            .map((message) => ({ role: message.role, content: message.content }))
        })
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Unable to get a response right now');
      }

      const replyText = String(payload?.data?.reply || '').trim();

      setMessages((current) => {
        const withoutTyping = current.filter((message) => message.status !== 'typing');
        return [...withoutTyping, { id: makeId(), role: 'assistant', content: replyText || 'I could not generate a reply just now.' }];
      });
    } catch (error: any) {
      const fallback = 'I am having trouble reaching the assistant right now. Please retry in a moment.';
      setErrorMessage(error?.message || fallback);
      setMessages((current) => {
        const withoutTyping = current.filter((message) => message.status !== 'typing');
        return [...withoutTyping, { id: makeId(), role: 'assistant', content: fallback, status: 'error' }];
      });
    } finally {
      setIsSending(false);
    }
  };

  const retryLastMessage = () => {
    if (!lastUserMessageRef.current) return;
    sendMessage(lastUserMessageRef.current);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-widget__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            className={`chat-widget chat-widget--${theme}`}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <header className="chat-widget__header">
              <div>
                <p className="chat-widget__eyebrow">Horizon Assistant</p>
                <h3>Travel help, booking guidance, and tour ideas</h3>
              </div>
              <div className="chat-widget__header-actions">
                <button type="button" className="chat-widget__icon-button" onClick={clearConversation} aria-label="Clear conversation">
                  <i className="ri-delete-bin-line"></i>
                </button>
                <button type="button" className="chat-widget__icon-button" onClick={() => setIsOpen(false)} aria-label="Minimize chat">
                  <i className="ri-subtract-line"></i>
                </button>
              </div>
            </header>

            <div className="chat-widget__quick-actions">
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} type="button" className="chat-widget__chip" onClick={() => void sendMessage(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="chat-widget__body" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`chat-widget__row chat-widget__row--${message.role}`}>
                  <div className={`chat-widget__bubble chat-widget__bubble--${message.role} ${message.status === 'error' ? 'is-error' : ''}`}>
                    {message.status === 'typing' ? (
                      <span className="chat-widget__typing">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <footer className="chat-widget__footer">
              {errorMessage && (
                <div className="chat-widget__error-bar">
                  <span>{errorMessage}</span>
                  <button type="button" onClick={retryLastMessage}>Retry</button>
                </div>
              )}

              <div className="chat-widget__composer">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about tours, pricing, or booking..."
                  aria-label="Chat message"
                />
                <button type="button" onClick={() => void sendMessage()} disabled={!input.trim() || isSending}>
                  {isSending ? 'Sending…' : 'Send'}
                </button>
              </div>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className="chat-widget__launcher"
        onClick={() => setIsOpen((current) => !current)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
      >
        <span className="chat-widget__launcher-icon">
          <i className={isOpen ? 'ri-close-line' : 'ri-chat-3-line'}></i>
        </span>
        <span className="chat-widget__launcher-copy">
          <strong>Ask Horizon</strong>
          <small>Travel assistant</small>
        </span>
      </motion.button>
    </>
  );
};

export default ChatWidget;