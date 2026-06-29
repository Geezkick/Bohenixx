"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";
import { Calendar as CalendarIcon, MapPin, Video, Users, CheckCircle } from "lucide-react";

export default function EventsPage() {
  const [rsvpedEvents, setRsvpedEvents] = useState<number[]>([]);

  const handleRSVP = (id: number) => {
    if (!rsvpedEvents.includes(id)) {
      setRsvpedEvents([...rsvpedEvents, id]);
    }
  };

  const events = [
    {
      id: 1,
      title: "Bohenix ONE: The Future of AI in African Enterprise",
      type: "Virtual Webinar",
      date: "October 12, 2026",
      time: "2:00 PM - 4:00 PM (EAT)",
      location: "Zoom",
      isVirtual: true,
      desc: "Join founder Brian Nyarienya for an exclusive walkthrough of the new BX Omni architecture and how it integrates with legacy enterprise resource planning systems.",
      attendees: 342
    },
    {
      id: 2,
      title: "Nairobi Smart Mobility Hackathon",
      type: "In-Person Event",
      date: "November 5-6, 2026",
      time: "9:00 AM (EAT)",
      location: "Nairobi Tech Hub, Kenya",
      isVirtual: false,
      desc: "A 48-hour hackathon utilizing the NjiaSafe API to build the next generation of road safety alerting systems. Cash prizes and BX Labs internships for winners.",
      attendees: 150
    },
    {
      id: 3,
      title: "Cybersecurity in the Era of Autonomous Agents",
      type: "Executive Briefing",
      date: "December 1, 2026",
      time: "10:00 AM (EAT)",
      location: "Virtual & Invite Only",
      isVirtual: true,
      desc: "A closed-door briefing for enterprise security teams on securing AI operations, focusing on zero-trust architectures for LLM integrations.",
      attendees: 45
    }
  ];

  return (
    <>
      <h1 className={styles.pageTitle}>Upcoming Events</h1>
      <p className={styles.pageDesc}>Register for webinars, hackathons, and exclusive executive briefings.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {events.map((event) => {
          const isRSVPed = rsvpedEvents.includes(event.id);
          
          return (
            <div key={event.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between' }}>
              
              <div style={{ flex: '1', minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: event.isVirtual ? '#00E5FF' : '#B14CFF', textTransform: 'uppercase', letterSpacing: '1px' }}>{event.type}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                    <Users size={14} /> {event.attendees} Attending
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{event.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{event.desc}</p>
                
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)' }}>
                    <CalendarIcon size={18} color="#B14CFF" /> {event.date} • {event.time}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)' }}>
                    {event.isVirtual ? <Video size={18} color="#00E5FF" /> : <MapPin size={18} color="#00E5FF" />}
                    {event.location}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', minWidth: '150px' }}>
                {isRSVPed ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', fontWeight: 600 }}>
                    <CheckCircle size={20} /> Registered
                  </div>
                ) : (
                  <button onClick={() => handleRSVP(event.id)} className={styles.btnPrimary} style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1.05rem' }}>
                    RSVP Now
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </>
  );
}
