'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, getProjects, getCards, Card, Project } from '@/lib/db';

const STATUSES = [
  { key: 'idea', label: '💡 Ideas', color: '#fbbf24' },
  { key: 'todo', label: '📋 To Do', color: '#3b82f6' },
  { key: 'in-progress', label: '🔥 In Progress', color: '#ef4444' },
  { key: 'done', label: '✅ Done', color: '#22c55e' }
];

const STATUS_ORDER = ['idea', 'todo', 'in-progress', 'done'];

export default function IdeaBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCard, setNewCard] = useState({ 
    title: '', 
    description: '', 
    project_id: '', 
    priority: 'medium' as Card['priority'] 
  });

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projData, cardData] = await Promise.all([
        getProjects(),
        getCards()
      ]);
      setProjects(projData);
      setCards(cardData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Real-time subscription
    if (supabase) {
      const channel = supabase
        .channel('cards-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'cards' },
          () => {
            console.log('🔄 Real-time update received');
            fetchData();
          }
        )
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, [fetchData]);

  const addCard = async () => {
    if (!newCard.title.trim() || !newCard.project_id) return;

    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard)
      });

      if (res.ok) {
        setNewCard({ title: '', description: '', project_id: '', priority: 'medium' });
        setShowAdd(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const moveCard = async (id: string, direction: 'left' | 'right') => {
    const card = cards.find(c => c.id === id);
    if (!card) return;

    const currentIdx = STATUS_ORDER.indexOf(card.status);
    const newIdx = direction === 'left' 
      ? Math.max(0, currentIdx - 1) 
      : Math.min(3, currentIdx + 1);
    
    const newStatus = STATUS_ORDER[newIdx] as Card['status'];

    // Optimistic update
    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));

    // API call
    await fetch('/api/cards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    });

    fetchData();
  };

  const voteCard = async (id: string) => {
    try {
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: id, action: 'vote' })
      });
      fetchData();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const deleteCard = async (id: string) => {
    if (!confirm('Delete this card?')) return;

    setCards(prev => prev.filter(c => c.id !== id));

    await fetch(`/api/cards?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const filteredCards = filter === 'all' 
    ? cards 
    : cards.filter(c => c.project_id === filter);

  const getProject = (projectId: string) => 
    projects.find(p => p.id === projectId) || { name: 'Unknown', color: '#71717A', icon: '📁' };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={spinnerStyle}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading board...</p>
          {supabase && <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>🔴 Real-time connected</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '24px' }}>
      {/* Header */}
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', margin: '0 0 8px' }}>
            🗂️ <span style={{ background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Project Board</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            {supabase ? '🔴 Real-time' : '📴 Offline mode'} • {cards.length} cards across {projects.length} projects
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
            ))}
          </select>
          
          <button onClick={() => setShowAdd(true)} style={addButtonStyle}>
            + Add Card
          </button>
        </div>
      </header>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {STATUSES.map(s => {
          const count = filteredCards.filter(c => c.status === s.key).length;
          return (
            <div key={s.key} style={{ ...statCardStyle, borderColor: s.color }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{count}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Add Card Modal */}
      {showAdd && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ margin: '0 0 20px' }}>Add New Card</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Title *</label>
              <input
                type="text"
                value={newCard.title}
                onChange={e => setNewCard({...newCard, title: e.target.value})}
                style={inputStyle}
                placeholder="What needs to be done?"
                autoFocus
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Description</label>
              <textarea
                value={newCard.description}
                onChange={e => setNewCard({...newCard, description: e.target.value})}
                style={{ ...inputStyle, minHeight: '80px' }}
                placeholder="More details..."
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Project *</label>
                <select
                  value={newCard.project_id}
                  onChange={e => setNewCard({...newCard, project_id: e.target.value})}
                  style={inputStyle}
                  required
                >
                  <option value="">Select project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Priority</label>
                <select
                  value={newCard.priority}
                  onChange={e => setNewCard({...newCard, priority: e.target.value as Card['priority']})}
                  style={inputStyle}
                >
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={addCard} style={submitBtnStyle}>Add Card</button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {STATUSES.map(status => {
          const statusCards = filteredCards.filter(c => c.status === status.key);
          return (
            <div key={status.key} style={columnStyle}>
              <div style={{ ...columnHeaderStyle, borderColor: status.color }}>
                <span>{status.label}</span>
                <span style={countBadgeStyle}>{statusCards.length}</span>
              </div>
              
              {statusCards.map(card => {
                const project = getProject(card.project_id);
                return (
                  <div key={card.id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: '600',
                        background: project.color + '20',
                        color: project.color
                      }}>
                        {project.icon} {project.name}
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {card.priority === 'high' && '🔴'}
                        {card.priority === 'medium' && '🟡'}
                        {card.priority === 'low' && '🟢'}
                      </div>
                    </div>
                    
                    <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '600' }}>{card.title}</h3>
                    
                    {card.description && (
                      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {card.description}
                      </p>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => voteCard(card.id)} style={voteBtnStyle}>
                          ⬆️ {card.votes}
                        </button>
                        {status.key !== 'idea' && (
                          <button onClick={() => moveCard(card.id, 'left')} style={actionBtnStyle}>←</button>
                        )}
                        {status.key !== 'done' && (
                          <button onClick={() => moveCard(card.id, 'right')} style={actionBtnStyle}>→</button>
                        )}
                      </div>
                      <button onClick={() => deleteCard(card.id)} style={deleteBtnStyle}>🗑️</button>
                    </div>
                  </div>
                );
              })}
              
              {statusCards.length === 0 && (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '14px' }}>
                  No cards
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const selectStyle = {
  padding: '10px 14px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontSize: '14px',
  cursor: 'pointer'
};

const addButtonStyle = {
  padding: '10px 20px',
  background: 'var(--gradient-1)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer'
};

const statCardStyle = {
  background: 'var(--bg-card)',
  borderRadius: '12px',
  padding: '16px 24px',
  border: '2px solid',
  minWidth: '100px'
};

const modalOverlayStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px'
};

const modalStyle = {
  background: 'var(--bg-card)',
  borderRadius: '16px',
  padding: '32px',
  maxWidth: '500px',
  width: '100%',
  border: '1px solid var(--border-subtle)'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontSize: '14px'
};

const cancelBtnStyle = {
  padding: '10px 20px',
  background: 'var(--bg-hover)',
  color: 'var(--text-primary)',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  cursor: 'pointer'
};

const submitBtnStyle = {
  padding: '10px 20px',
  background: 'var(--gradient-1)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer'
};

const columnStyle = {
  background: 'var(--bg-secondary)',
  borderRadius: '12px',
  padding: '16px',
  minHeight: '400px'
};

const columnHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px',
  borderBottom: '2px solid',
  marginBottom: '16px',
  fontWeight: '600'
};

const countBadgeStyle = {
  background: 'var(--bg-hover)',
  padding: '2px 10px',
  borderRadius: '12px',
  fontSize: '12px'
};

const cardStyle = {
  background: 'var(--bg-card)',
  borderRadius: '8px',
  padding: '14px',
  marginBottom: '12px',
  border: '1px solid var(--border-subtle)',
  cursor: 'grab'
};

const voteBtnStyle = {
  padding: '4px 10px',
  background: 'var(--bg-hover)',
  border: 'none',
  borderRadius: '4px',
  color: 'var(--text-secondary)',
  fontSize: '12px',
  cursor: 'pointer'
};

const actionBtnStyle = {
  padding: '4px 10px',
  background: 'var(--bg-hover)',
  border: 'none',
  borderRadius: '4px',
  color: 'var(--text-primary)',
  cursor: 'pointer'
};

const deleteBtnStyle = {
  padding: '4px 8px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  opacity: 0.6
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '3px solid var(--border-subtle)',
  borderTopColor: 'var(--accent-purple)',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  margin: '0 auto 16px'
};
