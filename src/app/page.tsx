import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '24px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🗂️</div>
        <h1 style={{ 
          fontSize: '36px', 
          marginBottom: '16px',
          background: 'var(--gradient-1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Project Board
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '18px' }}>
          Organize ideas and tasks across all your projects in one place.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
          <span style={tagStyle}>📈 TrendWatcher</span>
          <span style={tagStyle}>🛠️ HackerStack</span>
          <span style={tagStyle}>🤖 Autonomous</span>
          <span style={tagStyle}>👕 Calm Under Pressure</span>
        </div>
        
        <Link href="/board" style={{
          display: 'inline-block',
          padding: '16px 32px',
          background: 'var(--gradient-1)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          textDecoration: 'none'
        }}>
          Open Board →
        </Link>
      </div>
    </div>
  );
}

const tagStyle = {
  padding: '6px 12px',
  background: 'var(--bg-card)',
  borderRadius: '20px',
  fontSize: '13px',
  border: '1px solid var(--border-subtle)'
};
