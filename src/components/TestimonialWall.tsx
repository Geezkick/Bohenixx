"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquarePlus, X } from 'lucide-react';
import styles from './TestimonialWall.module.css';

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  message: string;
  rating: number;
  createdAt: string;
}

export default function TestimonialWall() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', company: '', message: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const data = await res.json();
        setTestimonials([data.testimonial, ...testimonials]);
        setSubmitSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
          setFormData({ name: '', company: '', message: '', rating: 5 });
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to submit testimonial", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Client Acknowledgments</h2>
          <p className={styles.subtitle}>See what our partners and clients say about us.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={styles.postBtn}>
          <MessageSquarePlus size={18} />
          Post Review
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>Loading testimonials...</div>
      ) : testimonials.length === 0 ? (
        <div className={styles.emptyState}>
          Be the first to share your experience with Bohenix!
        </div>
      ) : (
        <div className={styles.grid}>
          {testimonials.map((t) => (
            <motion.div 
              key={t.id} 
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className={styles.name}>{t.name}</h4>
                  {t.company && <span className={styles.company}>{t.company}</span>}
                </div>
              </div>
              <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < t.rating ? "#FFD700" : "transparent"} color={i < t.rating ? "#FFD700" : "rgba(255,255,255,0.2)"} />
                ))}
              </div>
              <p className={styles.message}>"{t.message}"</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
              
              {submitSuccess ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon}>✓</div>
                  <h3>Thank you!</h3>
                  <p>Your review has been posted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <h3>Share Your Experience</h3>
                  
                  <div className={styles.formGroup}>
                    <label>Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Company (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.company} 
                      onChange={(e) => setFormData({...formData, company: e.target.value})} 
                      placeholder="Your company"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Rating</label>
                    <div className={styles.starSelect}>
                      {[1,2,3,4,5].map((num) => (
                        <button 
                          type="button" 
                          key={num} 
                          onClick={() => setFormData({...formData, rating: num})}
                          className={styles.starBtn}
                        >
                          <Star size={24} fill={num <= formData.rating ? "#FFD700" : "transparent"} color={num <= formData.rating ? "#FFD700" : "rgba(255,255,255,0.2)"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Message *</label>
                    <textarea 
                      required 
                      rows={4}
                      value={formData.message} 
                      onChange={(e) => setFormData({...formData, message: e.target.value})} 
                      placeholder="How did Bohenix help you?"
                    />
                  </div>
                  
                  <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                    {isSubmitting ? "Posting..." : "Post Review"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
