'use client';

import React, { useState } from 'react';

const STATS = [
  { label: 'Total Verified Workers', value: '14,280', change: '+12% this week', color: '#38bdf8' },
  { label: 'Active Employers', value: '3,850', change: '+8% this week', color: '#818cf8' },
  { label: 'Completed Hires', value: '48,920', change: '₹3.8 Cr Transacted', color: '#4ade80' },
  { label: 'Pending Verifications', value: '124', change: 'Action Required', color: '#fbbf24' },
];

const PENDING_DOCS = [
  { id: 'doc-1', name: 'Vikram Singh', skill: 'Mason', docType: 'Aadhaar Card', status: 'PENDING', date: '10 mins ago' },
  { id: 'doc-2', name: 'Amit Kumar', skill: 'Electrician', docType: 'Skill Certificate', status: 'PENDING', date: '25 mins ago' },
  { id: 'doc-3', name: 'Pankaj Sharma', skill: 'Commercial Driver', docType: 'DL & Aadhaar', status: 'PENDING', date: '1 hour ago' },
];

export default function AdminPage() {
  const [docs, setDocs] = useState(PENDING_DOCS);

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    alert(`Worker document ${action.toLowerCase()} successfully!`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', borderRight: '1px solid #334155', padding: '24px' }}>
        <h2 style={{ color: '#38bdf8', fontSize: '24px', fontWeight: '800', margin: '0 0 32px 0' }}>Kaamorax</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a href="#" style={{ color: '#38bdf8', fontWeight: '700', textDecoration: 'none', padding: '10px 14px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
            📊 Overview & Operations
          </a>
          <a href="#" style={{ color: '#94a3b8', fontWeight: '600', textDecoration: 'none', padding: '10px 14px' }}>
            👨‍🏭 Verified Workers
          </a>
          <a href="#" style={{ color: '#94a3b8', fontWeight: '600', textDecoration: 'none', padding: '10px 14px' }}>
            🏗️ Employers & Companies
          </a>
          <a href="#" style={{ color: '#94a3b8', fontWeight: '600', textDecoration: 'none', padding: '10px 14px' }}>
            📋 Live Job Feed
          </a>
          <a href="#" style={{ color: '#94a3b8', fontWeight: '600', textDecoration: 'none', padding: '10px 14px' }}>
            🪪 KYC Document Verification
          </a>
          <a href="#" style={{ color: '#94a3b8', fontWeight: '600', textDecoration: 'none', padding: '10px 14px' }}>
            💳 Razorpay Payouts
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Operations & Moderation Console</h1>
            <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>Real-time monitoring across India blue-collar workforce marketplace</p>
          </div>
          <span style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#4ade80', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700' }}>
            🟢 System Health: 100% Operational
          </span>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
              <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>{stat.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: stat.color, margin: '8px 0' }}>{stat.value}</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Verification Queue */}
        <section style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0' }}>🪪 Pending Worker KYC & Document Approvals</h3>

          {docs.length === 0 ? (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>All verification requests cleared!</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f8fafc' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left', color: '#94a3b8', fontSize: '14px' }}>
                  <th style={{ padding: '12px' }}>Worker Name</th>
                  <th style={{ padding: '12px' }}>Primary Skill</th>
                  <th style={{ padding: '12px' }}>Submitted Document</th>
                  <th style={{ padding: '12px' }}>Submitted Time</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '14px 12px', fontWeight: '700' }}>{doc.name}</td>
                    <td style={{ padding: '14px 12px', color: '#38bdf8' }}>{doc.skill}</td>
                    <td style={{ padding: '14px 12px' }}>{doc.docType}</td>
                    <td style={{ padding: '14px 12px', color: '#94a3b8', fontSize: '13px' }}>{doc.date}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleAction(doc.id, 'APPROVED')}
                        style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', marginRight: '8px' }}
                      >
                        Approve ✓
                      </button>
                      <button
                        onClick={() => handleAction(doc.id, 'REJECTED')}
                        style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}
                      >
                        Reject ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
