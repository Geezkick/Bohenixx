"use client";

import { useState } from "react";
import styles from "./request.module.css";
import { ArrowRightIcon, ArrowLeftIcon, CheckIcon } from "@/components/Icons";

const SERVICES = [
  "Software Development",
  "AI & Machine Learning",
  "Cloud Infrastructure",
  "UI/UX Design",
  "Cybersecurity",
  "Consulting & Strategy"
];

export default function ServiceRequest() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    budget: "",
    timeline: "",
    details: "",
    email: ""
  });

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/services/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      // Optionally redirect to checkout for a consultation fee, or just show success
      nextStep(); // Move to success step
    } catch (error) {
      console.error('Failed to submit request', error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Service Request</h1>
          <p>Partner with Bohenix for world-class engineering.</p>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar} style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        <form className={`${styles.form} glass-panel`} onSubmit={handleSubmit}>
          {step === 1 && (
            <div className={styles.step}>
              <h2>Select a Service</h2>
              <div className={styles.optionsGrid}>
                {SERVICES.map(svc => (
                  <button
                    key={svc}
                    type="button"
                    className={`${styles.optionBtn} ${formData.service === svc ? styles.selected : ''}`}
                    onClick={() => setFormData({ ...formData, service: svc })}
                  >
                    {svc}
                  </button>
                ))}
              </div>
              <div className={styles.navButtons}>
                <button type="button" className={styles.nextBtn} onClick={nextStep} disabled={!formData.service}>
                  Next <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.step}>
              <h2>Project Details</h2>
              
              <div className={styles.inputGroup}>
                <label>Estimated Budget (KES)</label>
                <select 
                  value={formData.budget} 
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  className={styles.input}
                >
                  <option value="">Select a range...</option>
                  <option value="50k-100k">50,000 - 100,000</option>
                  <option value="100k-500k">100,000 - 500,000</option>
                  <option value="500k-1M">500,000 - 1,000,000</option>
                  <option value="1M+">1,000,000+</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Expected Timeline</label>
                <select 
                  value={formData.timeline} 
                  onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                  className={styles.input}
                >
                  <option value="">Select timeline...</option>
                  <option value="1-month">Under 1 Month</option>
                  <option value="1-3-months">1 - 3 Months</option>
                  <option value="3-6-months">3 - 6 Months</option>
                  <option value="6-months+">6+ Months</option>
                </select>
              </div>

              <div className={styles.navButtons}>
                <button type="button" className={styles.prevBtn} onClick={prevStep}>
                  <ArrowLeftIcon size={16} /> Back
                </button>
                <button type="button" className={styles.nextBtn} onClick={nextStep} disabled={!formData.budget || !formData.timeline}>
                  Next <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.step}>
              <h2>Final Details</h2>
              
              <div className={styles.inputGroup}>
                <label>Project Description</label>
                <textarea 
                  rows={4}
                  value={formData.details} 
                  onChange={e => setFormData({ ...formData, details: e.target.value })}
                  className={styles.input}
                  placeholder="Tell us about your project goals..."
                ></textarea>
              </div>

              <div className={styles.inputGroup}>
                <label>Work Email</label>
                <input 
                  type="email"
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={styles.input}
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className={styles.navButtons}>
                <button type="button" className={styles.prevBtn} onClick={prevStep}>
                  <ArrowLeftIcon size={16} /> Back
                </button>
                <button type="submit" className={styles.submitBtn} disabled={!formData.details || !formData.email}>Submit Request</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className={styles.stepSuccess}>
              <div className={styles.successIcon}>
                <CheckIcon size={48} color="#00E5FF" />
              </div>
              <h2>Request Received</h2>
              <p>Thank you for choosing Bohenix. Our engineering team will review your request for <strong>{formData.service}</strong> and contact you at {formData.email} within 24 hours.</p>
              <button type="button" className={styles.nextBtn} onClick={() => window.location.href = '/'}>Return Home</button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
