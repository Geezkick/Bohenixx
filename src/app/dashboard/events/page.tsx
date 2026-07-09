"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import { Calendar as CalendarIcon, MapPin, Video, Users, CheckCircle, Loader2 } from "lucide-react";

const events = [
  {
    id: "flow-ai-launch-2026",
    title: "Bohenix Flow AI: The Autonomous Workforce",
    type: "Virtual Launch",
    date: "October 15, 2026",
    time: "3:00 PM - 5:00 PM (EAT)",
    location: "Zoom & Bohenix Live",
    isVirtual: true,
    desc: "Join founder Brian Nyarienya for an exclusive walkthrough of Bohenix Flow AI. Discover how autonomous AI agents can manage your entire company's operations, sales, and support seamlessly.",
    attendees: 512,
  },
  {
    id: "enterprise-engineering-summit-2026",
    title: "Enterprise Software & Cloud Architecture Summit",
    type: "In-Person Event",
    date: "November 10-11, 2026",
    time: "9:00 AM (EAT)",
    location: "Nairobi Tech Hub, Kenya",
    isVirtual: false,
    desc: "A two-day summit on building production-grade enterprise software systems and scalable cloud infrastructure. Network with our lead engineers and discover custom solutions tailored for your business needs.",
    attendees: 250,
  },
  {
    id: "ai-cybersecurity-briefing-2026",
    title: "AI Integration & Zero-Trust Security Briefing",
    type: "Executive Briefing",
    date: "December 5, 2026",
    time: "10:00 AM (EAT)",
    location: "Virtual & Invite Only",
    isVirtual: true,
    desc: "A closed-door briefing for enterprise teams on safely integrating AI agents into legacy workflows while maintaining strict zero-trust security, compliance, and proactive threat detection.",
    attendees: 65,
  },
];

export default function EventsPage() {
  const [rsvpedIds, setRsvpedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events/rsvp")
      .then((res) => res.json())
      .then((data) => {
        if (data.eventIds) setRsvpedIds(data.eventIds);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRSVP = async (eventId: string, eventTitle: string) => {
    setPendingId(eventId);
    try {
      const res = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, eventTitle }),
      });
      if (res.ok) {
        setRsvpedIds((prev) => [...prev, eventId]);
      }
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Upcoming Events</h1>
      <p className={styles.pageDesc}>Register for webinars, hackathons, and exclusive executive briefings.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {events.map((event) => {
          const isRSVPed = rsvpedIds.includes(event.id);
          const isPending = pendingId === event.id;

          return (
            <div key={event.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem", display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between" }}>

              <div style={{ flex: "1", minWidth: "300px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: event.isVirtual ? "#00E5FF" : "#B14CFF", textTransform: "uppercase", letterSpacing: "1px" }}>{event.type}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
                    <Users size={14} /> {event.attendees} Attending
                  </div>
                </div>

                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>{event.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "1.5rem" }}>{event.desc}</p>

                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.8)" }}>
                    <CalendarIcon size={18} color="#B14CFF" /> {event.date} • {event.time}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.8)" }}>
                    {event.isVirtual ? <Video size={18} color="#00E5FF" /> : <MapPin size={18} color="#00E5FF" />}
                    {event.location}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", minWidth: "150px" }}>
                {loading ? (
                  <div style={{ width: "100%", padding: "1rem", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                    <Loader2 size={20} className="spin" />
                  </div>
                ) : isRSVPed ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "1rem", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", fontWeight: 600 }}>
                    <CheckCircle size={20} /> Registered
                  </div>
                ) : (
                  <button
                    onClick={() => handleRSVP(event.id, event.title)}
                    disabled={isPending}
                    className={styles.btnPrimary}
                    style={{ width: "100%", padding: "1rem", justifyContent: "center", fontSize: "1.05rem", opacity: isPending ? 0.6 : 1 }}
                  >
                    {isPending ? "Registering..." : "RSVP Now"}
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
