'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'executing' | 'done';
  result?: string;
  created_at: string;
}

interface AgentStatus {
  status: 'idle' | 'executing' | 'down';
  currentTask?: string;
  lastActive: string;
}

export default function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  // Agent Status States
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    status: 'idle', // 'idle' | 'executing' | 'down'
    currentTask: undefined,
    lastActive: new Date().toISOString(),
  });
  const router = useRouter();
  const tasksEndRef = useRef<HTMLDivElement>(null);

  // Check auth
  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('mission_token='));
    if (!token) {
      router.push('/login');
    } else {
      setAuthenticated(true);
      loadTasks();
    }
    setLoading(false);
  }, [router]);

  // Scroll to bottom when new tasks arrive
  useEffect(() => {
    tasksEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch {
      // Start with empty tasks
    }
  };

  const handleLogout = () => {
    document.cookie = 'mission_token=; path=/; max-age=0';
    router.push('/login');
  };

  const submitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    // Add task locally
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      status: 'executing',
      created_at: new Date().toISOString(),
    };

    setTasks(prev => [...prev, task]);
    setNewTask('');

    // Mark agent as busy
    setAgentStatus({ status: 'executing', currentTask: task.title });

    try {
      // Send to my execution engine
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: task.title, taskId: task.id }),
      });

      const data = await res.json();

      // Update task with result
      setTasks(prev => prev.map(t => 
        t.id === task.id 
          ? { ...t, status: 'done', result: data.result || 'Task completed' }
          : t
      ));

      // Mark agent as idle
      setAgentStatus({ status: 'idle', lastActive: new Date().toISOString() });
    } catch (error) {
      setTasks(prev => prev.map(t => 
        t.id === task.id 
          ? { ...t, status: 'done', result: 'Error: Could not execute' }
          : t
      ));
      setAgentStatus({ status: 'idle', lastActive: new Date().toISOString() });
    }
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle}></div>
        <p>Loading Mission Control...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          <h1 style={headerTitleStyle}>Mission Control</h1>
          <span style={headerSubtitleStyle}>Private AI Agent Interface</span>
        </div>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          🚪 Logout
        </button>
      </header>

      <main style={mainStyle}>
        {/* Agent Status Card */}
        <div style={agentCardStyle}>
          {/* Agent Avatar */}
          <div style={avatarContainerStyle}>
            <div style={{
              ...avatarStyle,
              background: agentStatus.status === 'down' 
                ? 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)'
                : agentStatus.status === 'executing' 
                ? 'linear-gradient(135deg, #00C9FF 0%, #22C55E 100%)'
                : 'var(--gradient-1)',
              animation: agentStatus.status === 'executing' 
                ? 'pulse 1s infinite' 
                : agentStatus.status === 'down'
                ? 'none'
                : 'float 3s ease-in-out',
            }}>
              <span style={{ fontSize: '48px' }}>🕶️</span>
            </div>
            <div style={statusIndicatorStyle(agentStatus.status)}></div>
          </div>

          {/* Agent Info */}
          <div style={agentInfoStyle}>
            <h2 style={agentNameStyle}>Mr. Anderson</h2>
            <p style={agentStatusTextStyle(agentStatus.status)}>
              {agentStatus.status === 'down' 
                ? '🔴 DOWN - System Unavailable'
                : agentStatus.status === 'executing' 
                ? `⚡ Executing: "${agentStatus.currentTask}"`
                : '💤 Idle - Ready for missions'}
            </p>
            <p style={lastActiveStyle}>
              Last active: {new Date(agentStatus.lastActive).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Task Input */}
        <form onSubmit={submitTask} style={inputFormStyle}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder={agentStatus.status === 'down' ? "🔴 Agent is down - Check back later" : "Enter a mission for Mr. Anderson..."}
            style={taskInputStyle}
            disabled={agentStatus.status !== 'idle'}
          />
          <button 
            type="submit" 
            style={agentStatus.status !== 'idle' ? submitButtonDisabledStyle : submitButtonStyle}
            disabled={agentStatus.status !== 'idle'}
          >
            {agentStatus.status === 'executing' 
              ? '⏳ Executing...' 
              : agentStatus.status === 'down'
              ? '🔴 Agent Down'
              : '🚀 Send Mission'}
          </button>
        </form>

        {/* Task History */}
        <div style={tasksContainerStyle}>
          <h3 style={tasksTitleStyle}>Mission History</h3>
          <div style={tasksListStyle}>
            {tasks.length === 0 ? (
              <p style={emptyStyle}>No missions yet. Send your first task!</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} style={taskCardStyle}>
                  <div style={taskHeaderStyle}>
                    <span style={{
                      ...taskStatusDotStyle,
                      background: task.status === 'done' ? 'var(--accent-green)' : 'var(--accent-red)',
                    }}></span>
                    <span style={taskTitleStyle}>{task.title}</span>
                  </div>
                  {task.result && (
                    <p style={taskResultStyle}>{task.result}</p>
                  )}
                  <span style={taskTimeStyle}>
                    {new Date(task.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
            <div ref={tasksEndRef}></div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'var(--bg-primary)',
};

const loadingStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
};

const spinnerStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '3px solid var(--border-subtle)',
  borderTopColor: 'var(--accent-purple)',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 32px',
  borderBottom: '1px solid var(--border-subtle)',
  background: 'var(--bg-secondary)',
};

const headerLeftStyle: React.CSSProperties = {};

const headerTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '700',
  margin: 0,
  background: 'var(--gradient-1)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const headerSubtitleStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-tertiary)',
};

const logoutButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: 'transparent',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  color: 'var(--text-secondary)',
  fontSize: '14px',
  cursor: 'pointer',
};

const mainStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '32px 20px',
};

const agentCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  background: 'var(--bg-card)',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid var(--border-subtle)',
  marginBottom: '32px',
};

const avatarContainerStyle: React.CSSProperties = {
  position: 'relative',
};

const avatarStyle: React.CSSProperties = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const statusIndicatorStyle: (status: string) => React.CSSProperties = (status) => ({
  position: 'absolute',
  bottom: '2px',
  right: '2px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  background: status === 'down' ? 'var(--accent-red)' : status === 'executing' ? 'var(--accent-green)' : 'var(--accent-green)',
  border: '3px solid var(--bg-card)',
  boxShadow: status === 'executing' ? '0 0 10px #22c55e' : 'none',
});

const agentInfoStyle: React.CSSProperties = {
  flex: 1,
};

const agentNameStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const agentStatusTextStyle: (status: string) => React.CSSProperties = (status) => ({
  color: status === 'executing' ? 'var(--accent-red)' : 'var(--text-secondary)',
  margin: '0 0 4px',
  fontSize: '14px',
});

const lastActiveStyle: React.CSSProperties = {
  color: 'var(--text-tertiary)',
  fontSize: '12px',
  margin: 0,
});

const inputFormStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginBottom: '32px',
};

const taskInputStyle: React.CSSProperties = {
  flex: 1,
  padding: '14px 16px',
  background: 'var(--bg-card)',
  border: '2px solid var(--border-subtle)',
  borderRadius: '12px',
  color: 'var(--text-primary)',
  fontSize: '16px',
  outline: 'none',
};

const submitButtonStyle: React.CSSProperties = {
  padding: '14px 24px',
  background: 'var(--gradient-1)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const submitButtonDisabledStyle: React.CSSProperties = {
  ...submitButtonStyle,
  opacity: 0.6,
  cursor: 'not-allowed',
};

const tasksContainerStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid var(--border-subtle)',
};

const tasksTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const tasksListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  maxHeight: '400px',
  overflowY: 'auto',
};

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  color: 'var(--text-tertiary)',
  padding: '24px',
};

const taskCardStyle: React.CSSProperties = {
  background: 'var(--bg-primary)',
  borderRadius: '12px',
  padding: '16px',
  border: '1px solid var(--border-subtle)',
};

const taskHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '8px',
};

const taskStatusDotStyle: React.CSSProperties = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
};

const taskTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '500',
  margin: 0,
};

const taskResultStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  margin: '8px 0 0',
  padding: '8px',
  background: 'var(--bg-hover)',
  borderRadius: '6px',
};

const taskTimeStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  color: 'var(--text-tertiary)',
  marginTop: '8px',
};
