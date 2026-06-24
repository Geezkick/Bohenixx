"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareIcon, XIcon, SendIcon } from 'lucide-react';
import styles from './AskBohenix.module.css';

export default function AskBohenix() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Hi! I am the Bohenix AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'Thank you for your inquiry. A Bohenix representative will review this shortly, or please visit our contact page.' }]);
    }, 1000);
  };

  return (
    <>
      <button className={styles.fab} onClick={() => setIsOpen(true)}>
        <MessageSquareIcon size={24} color="#fff" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <div className={styles.avatar}>B</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Ask Bohenix</h4>
                  <span style={{ fontSize: '0.75rem', color: '#00E5FF' }}>AI Assistant</span>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <XIcon size={20} color="#fff" />
              </button>
            </div>

            <div className={styles.messages}>
              {messages.map((m, i) => (
                <div key={i} className={`${styles.message} ${m.role === 'ai' ? styles.messageAi : styles.messageUser}`}>
                  {m.text}
                </div>
              ))}
            </div>

            <form className={styles.inputArea} onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                className={styles.input}
              />
              <button type="submit" className={styles.sendBtn}>
                <SendIcon size={18} color="#fff" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
