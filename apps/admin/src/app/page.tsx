'use client';

import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = 'overview' | 'workers' | 'employers' | 'jobs' | 'kyc' | 'payments';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Verified Workers', value: '14,280', change: '+12% this week', icon: '👷', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  { label: 'Active Employers', value: '3,850', change: '+8% this week', icon: '🏗️', color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
  { label: 'Completed Hires', value: '48,920', change: '₹3.8 Cr transacted', icon: '✅', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  { label: 'Pending KYC', value: '124', change: 'Action Required', icon: '🪪', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  { label: 'Active Bookings', value: '892', change: '+5% today', icon: '📋', color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
  { label: 'Total Revenue', value: '₹3.8 Cr', change: 'Platform GMV', icon: '💰', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
];

const WORKERS = [
  { id: 'w1', name: 'Ramesh Verma', skill: 'Mason (Rajmistri)', city: 'Noida', rating: 4.8, jobs: 42, status: 'VERIFIED', online: true, earnings: '₹1,24,000' },
  { id: 'w2', name: 'Suresh Kumar', skill: 'Electrician', city: 'Delhi', rating: 4.9, jobs: 67, status: 'VERIFIED', online: true, earnings: '₹2,01,600' },
  { id: 'w3', name: 'Manoj Singh', skill: 'Painter', city: 'Ghaziabad', rating: 4.7, jobs: 31, status: 'VERIFIED', online: false, earnings: '₹93,000' },
  { id: 'w4', name: 'Vijay Yadav', skill: 'Plumber', city: 'Noida', rating: 4.6, jobs: 28, status: 'PENDING', online: false, earnings: '₹84,000' },
  { id: 'w5', name: 'Raju Prasad', skill: 'Construction Helper', city: 'Faridabad', rating: 4.5, jobs: 19, status: 'VERIFIED', online: true, earnings: '₹57,000' },
];

const EMPLOYERS = [
  { id: 'e1', name: 'Sharma Construction Co.', type: 'CONTRACTOR', city: 'Noida', totalHires: 184, spent: '₹12.4L', rating: 4.7, verified: true },
  { id: 'e2', name: 'Metro Logistics Ltd.', type: 'WAREHOUSE', city: 'Delhi', totalHires: 320, spent: '₹18.2L', rating: 4.8, verified: true },
  { id: 'e3', name: 'Rajesh Kumar', type: 'INDIVIDUAL', city: 'Ghaziabad', totalHires: 8, spent: '₹24,000', rating: 4.5, verified: false },
  { id: 'e4', name: 'Grand Palace Hotel', type: 'HOTEL', city: 'Delhi', totalHires: 95, spent: '₹7.8L', rating: 4.6, verified: true },
];

const JOBS = [
  { id: 'j1', title: 'Need 3 Masons – Wall Plastering', employer: 'Sharma Construction', skill: 'Mason', city: 'Noida', rate: '₹850/day', status: 'OPEN', matches: 7, urgency: 'IMMEDIATE' },
  { id: 'j2', title: 'Warehouse Loaders Needed (20 workers)', employer: 'Metro Logistics', skill: 'Loader', city: 'Delhi', rate: '₹650/day', status: 'IN_PROGRESS', matches: 20, urgency: 'HIGH' },
  { id: 'j3', title: 'House Painting – 3 BHK', employer: 'Rajesh Kumar', skill: 'Painter', city: 'Ghaziabad', rate: '₹750/day', status: 'FILLED', matches: 3, urgency: 'MEDIUM' },
  { id: 'j4', title: 'Hotel Housekeeping Staff', employer: 'Grand Palace Hotel', skill: 'Housemaid', city: 'Delhi', rate: '₹700/day', status: 'OPEN', matches: 12, urgency: 'HIGH' },
  { id: 'j5', title: 'Commercial Driver – Delivery Truck', employer: 'Sharma Construction', skill: 'Driver', city: 'Noida', rate: '₹1100/day', status: 'COMPLETED', matches: 2, urgency: 'IMMEDIATE' },
];

const PENDING_DOCS = [
  { id: 'd1', name: 'Vikram Singh', skill: 'Mason', docType: 'Aadhaar Card', status: 'PENDING', time: '10 mins ago', phone: '+91 98765 43210' },
  { id: 'd2', name: 'Amit Kumar', skill: 'Electrician', docType: 'Skill Certificate', status: 'PENDING', time: '25 mins ago', phone: '+91 98123 45678' },
  { id: 'd3', name: 'Pankaj Sharma', skill: 'Commercial Driver', docType: 'DL & Aadhaar', status: 'PENDING', time: '1 hour ago', phone: '+91 97112 23344' },
  { id: 'd4', name: 'Dinesh Patel', skill: 'Welder', docType: 'Aadhaar Card', status: 'PENDING', time: '2 hours ago', phone: '+91 96543 21098' },
];

const PAYMENTS = [
  { id: 'p1', worker: 'Ramesh Verma', employer: 'Sharma Construction', amount: '₹8,500', method: 'UPI', status: 'SUCCESS', date: '28 Jul 2026' },
  { id: 'p2', worker: 'Suresh Kumar', employer: 'Metro Logistics', amount: '₹9,000', method: 'NETBANKING', status: 'SUCCESS', date: '28 Jul 2026' },
  { id: 'p3', worker: 'Manoj Singh', employer: 'Rajesh Kumar', amount: '₹7,500', method: 'UPI', status: 'PROCESSING', date: '27 Jul 2026' },
  { id: 'p4', worker: 'Raju Prasad', employer: 'Grand Palace Hotel', amount: '₹7,000', method: 'CASH', status: 'FAILED', date: '27 Jul 2026' },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function Badge({ label, color }: { label: string; color: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    VERIFIED: { bg: 'rgba(74,222,128,0.15)', text: '#4ade80' },
    PENDING: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
    OPEN: { bg: 'rgba(56,189,248,0.15)', text: '#38bdf8' },
    IN_PROGRESS: { bg: 'rgba(129,140,248,0.15)', text: '#818cf8' },
    FILLED: { bg: 'rgba(52,211,153,0.15)', text: '#34d399' },
    COMPLETED: { bg: 'rgba(74,222,128,0.15)', text: '#4ade80' },
    CANCELLED: { bg: 'rgba(248,113,113,0.15)', text: '#f87171' },
    SUCCESS: { bg: 'rgba(74,222,128,0.15)', text: '#4ade80' },
    PROCESSING: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
    FAILED: { bg: 'rgba(248,113,113,0.15)', text: '#f87171' },
    IMMEDIATE: { bg: 'rgba(248,113,113,0.15)', text: '#f87171' },
    HIGH: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
    MEDIUM: { bg: 'rgba(56,189,248,0.15)', text: '#38bdf8' },
  };
  const style = colors[label] || { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8' };
  return (
    <span style={{
      backgroundColor: style.bg,
      color: style.text,
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '0.4px',
    }}>
      {label}
    </span>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>{title}</h2>
        {subtitle && <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Table Wrapper ────────────────────────────────────────────────────────────
function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={{
                padding: '12px 16px',
                textAlign: 'left',
                color: '#475569',
                fontWeight: 600,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                borderBottom: '1px solid #1e293b',
                whiteSpace: 'nowrap',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function TR({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <tr
      style={{ borderBottom: '1px solid #0f172a', backgroundColor: hover ? 'rgba(255,255,255,0.02)' : 'transparent', cursor: onClick ? 'pointer' : 'default', transition: 'background 0.15s' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

function TD({ children, bold }: { children: React.ReactNode; bold?: boolean }) {
  return (
    <td style={{ padding: '14px 16px', color: bold ? '#f1f5f9' : '#94a3b8', fontWeight: bold ? 700 : 400, verticalAlign: 'middle' }}>
      {children}
    </td>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      backgroundColor: '#0f172a',
      borderRadius: 16,
      border: '1px solid #1e293b',
      padding: 24,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Overview Page ────────────────────────────────────────────────────────────
function OverviewPage() {
  return (
    <>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {STATS.map((s) => (
          <Card key={s.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ color: '#475569', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: '#334155', fontSize: 12, marginTop: 6 }}>{s.change}</div>
              </div>
              <div style={{ backgroundColor: s.bg, borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {s.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent KYC Queue */}
        <Card>
          <SectionHeader title="🪪 KYC Queue" subtitle="Pending document verifications" />
          {PENDING_DOCS.slice(0, 3).map((doc) => (
            <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 15 }}>{doc.name}</div>
                <div style={{ color: '#64748b', fontSize: 13 }}>{doc.skill} • {doc.docType}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Badge label="PENDING" color="" />
                <div style={{ color: '#334155', fontSize: 12, marginTop: 4 }}>{doc.time}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Recent Jobs */}
        <Card>
          <SectionHeader title="⚡ Live Job Feed" subtitle="Real-time active postings" />
          {JOBS.slice(0, 4).map((job) => (
            <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
                <div style={{ color: '#64748b', fontSize: 13 }}>{job.employer} • {job.city}</div>
              </div>
              <div style={{ marginLeft: 12, flexShrink: 0 }}>
                <Badge label={job.status} color="" />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}

// ─── Workers Page ─────────────────────────────────────────────────────────────
function WorkersPage() {
  return (
    <Card>
      <SectionHeader title="👷 Verified Workers" subtitle={`${WORKERS.length} workers in the platform`} />
      <Table headers={['Name', 'Skill', 'City', 'Rating', 'Jobs', 'Earnings', 'Status', 'Online']}>
        {WORKERS.map((w) => (
          <TR key={w.id}>
            <TD bold>{w.name}</TD>
            <TD>{w.skill}</TD>
            <TD>{w.city}</TD>
            <TD><span style={{ color: '#fbbf24', fontWeight: 700 }}>★ {w.rating}</span></TD>
            <TD>{w.jobs}</TD>
            <TD><span style={{ color: '#4ade80', fontWeight: 700 }}>{w.earnings}</span></TD>
            <TD><Badge label={w.status} color="" /></TD>
            <TD>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: w.online ? '#4ade80' : '#475569', display: 'inline-block' }} />
            </TD>
          </TR>
        ))}
      </Table>
    </Card>
  );
}

// ─── Employers Page ───────────────────────────────────────────────────────────
function EmployersPage() {
  return (
    <Card>
      <SectionHeader title="🏗️ Employers & Companies" subtitle={`${EMPLOYERS.length} registered employers`} />
      <Table headers={['Company / Name', 'Type', 'City', 'Total Hires', 'Total Spent', 'Rating', 'Verified']}>
        {EMPLOYERS.map((e) => (
          <TR key={e.id}>
            <TD bold>{e.name}</TD>
            <TD>{e.type}</TD>
            <TD>{e.city}</TD>
            <TD>{e.totalHires}</TD>
            <TD><span style={{ color: '#4ade80', fontWeight: 700 }}>{e.spent}</span></TD>
            <TD><span style={{ color: '#fbbf24', fontWeight: 700 }}>★ {e.rating}</span></TD>
            <TD><Badge label={e.verified ? 'VERIFIED' : 'PENDING'} color="" /></TD>
          </TR>
        ))}
      </Table>
    </Card>
  );
}

// ─── Jobs Page ────────────────────────────────────────────────────────────────
function JobsPage() {
  return (
    <Card>
      <SectionHeader title="📋 Live Job Feed" subtitle="All active & historical job postings" />
      <Table headers={['Job Title', 'Employer', 'Skill', 'City', 'Rate', 'Matches', 'Urgency', 'Status']}>
        {JOBS.map((j) => (
          <TR key={j.id}>
            <TD bold>{j.title}</TD>
            <TD>{j.employer}</TD>
            <TD>{j.skill}</TD>
            <TD>{j.city}</TD>
            <TD><span style={{ color: '#38bdf8', fontWeight: 700 }}>{j.rate}</span></TD>
            <TD>{j.matches}</TD>
            <TD><Badge label={j.urgency} color="" /></TD>
            <TD><Badge label={j.status} color="" /></TD>
          </TR>
        ))}
      </Table>
    </Card>
  );
}

// ─── KYC Page ─────────────────────────────────────────────────────────────────
function KycPage() {
  const [docs, setDocs] = useState(PENDING_DOCS);

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <Card>
      <SectionHeader
        title="🪪 KYC Document Verification"
        subtitle={`${docs.length} documents awaiting review`}
      />
      {docs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#475569' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#4ade80' }}>All Clear!</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>No pending verification requests</div>
        </div>
      ) : (
        <Table headers={['Worker Name', 'Skill', 'Document Type', 'Phone', 'Received', 'Actions']}>
          {docs.map((doc) => (
            <TR key={doc.id}>
              <TD bold>{doc.name}</TD>
              <TD>{doc.skill}</TD>
              <TD>{doc.docType}</TD>
              <TD>{doc.phone}</TD>
              <TD>{doc.time}</TD>
              <td style={{ padding: '12px 16px' }}>
                <button
                  onClick={() => handleAction(doc.id, 'APPROVED')}
                  style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, marginRight: 8, fontSize: 13 }}
                >
                  Approve ✓
                </button>
                <button
                  onClick={() => handleAction(doc.id, 'REJECTED')}
                  style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
                >
                  Reject ✕
                </button>
              </td>
            </TR>
          ))}
        </Table>
      )}
    </Card>
  );
}

// ─── Payments Page ────────────────────────────────────────────────────────────
function PaymentsPage() {
  return (
    <Card>
      <SectionHeader title="💳 Razorpay Payouts" subtitle="Payment transactions across the platform" />
      <Table headers={['Worker', 'Employer', 'Amount', 'Method', 'Date', 'Status']}>
        {PAYMENTS.map((p) => (
          <TR key={p.id}>
            <TD bold>{p.worker}</TD>
            <TD>{p.employer}</TD>
            <TD><span style={{ color: '#4ade80', fontWeight: 800 }}>{p.amount}</span></TD>
            <TD>{p.method}</TD>
            <TD>{p.date}</TD>
            <TD><Badge label={p.status} color="" /></TD>
          </TR>
        ))}
      </Table>
    </Card>
  );
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────
function NavItem({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '11px 16px',
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
        backgroundColor: active ? 'rgba(56,189,248,0.12)' : 'transparent',
        color: active ? '#38bdf8' : '#64748b',
        fontWeight: active ? 700 : 500,
        fontSize: 14,
        textAlign: 'left',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
      {label}
      {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#38bdf8' }} />}
    </button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [page, setPage] = useState<Page>('overview');

  const nav = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'workers', icon: '👷', label: 'Workers' },
    { id: 'employers', icon: '🏗️', label: 'Employers' },
    { id: 'jobs', icon: '📋', label: 'Live Jobs' },
    { id: 'kyc', icon: '🪪', label: 'KYC Verification' },
    { id: 'payments', icon: '💳', label: 'Payments' },
  ];

  const pageMap: Record<Page, React.ReactNode> = {
    overview: <OverviewPage />,
    workers: <WorkersPage />,
    employers: <EmployersPage />,
    jobs: <JobsPage />,
    kyc: <KycPage />,
    payments: <PaymentsPage />,
  };

  const pageTitles: Record<Page, string> = {
    overview: 'Operations & Moderation Console',
    workers: 'Worker Management',
    employers: 'Employer Management',
    jobs: 'Live Job Feed',
    kyc: 'KYC Document Verification',
    payments: 'Payment Transactions',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020817', color: '#f1f5f9', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside style={{
        width: 260,
        backgroundColor: '#0a1628',
        borderRight: '1px solid #1e293b',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.5px' }}>Kaamorax</div>
          <div style={{ fontSize: 12, color: '#334155', marginTop: 3, fontWeight: 500 }}>Admin Console v1.0</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {nav.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={page === item.id}
              onClick={() => setPage(item.id as Page)}
            />
          ))}
        </nav>

        {/* System Status */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
            <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>All Systems Operational</span>
          </div>
          <div style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>API • DB • Razorpay • FCM</div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Bar */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 32px',
          backgroundColor: '#0a1628',
          borderBottom: '1px solid #1e293b',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>{pageTitles[page]}</h1>
            <p style={{ margin: '3px 0 0', color: '#475569', fontSize: 13 }}>
              Real-time monitoring • Kaamorax Platform
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{
              backgroundColor: 'rgba(56,189,248,0.1)',
              border: '1px solid rgba(56,189,248,0.3)',
              color: '#38bdf8',
              padding: '8px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
            }}>
              🔔 4 Alerts
            </button>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 15,
              color: '#fff',
              cursor: 'pointer',
            }}>
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: 32, flex: 1 }}>
          {pageMap[page]}
        </div>
      </main>
    </div>
  );
}
