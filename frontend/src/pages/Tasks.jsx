import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';
import { CheckCircle, Clock } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDate) return;
    try {
      const res = await axios.post(`${API_URL}/tasks`, { title: newTaskTitle, dueDate: newTaskDate });
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
      setNewTaskDate('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const res = await axios.put(`${API_URL}/tasks/${task._id}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === task._id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage your organization's compliance tasks and to-dos.</p>
        </div>
      </div>

      <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Add New Task</h3>
        <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input className="input-field" style={{ flex: 1, minWidth: '200px' }} type="text" placeholder="Task Title (e.g., GST Filing)" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} required />
          <input className="input-field" style={{ width: 'auto' }} type="date" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)} required />
          <button type="submit" className="btn btn-primary">Add Task</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#FBBF24' }}>
            <Clock size={20} /> Pending Tasks ({pendingTasks.length})
          </h3>
          {pendingTasks.map(task => (
            <div key={task._id} className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>⚠️ {task.title}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
              </div>
              <button className="btn btn-secondary" onClick={() => toggleTask(task)} style={{ fontSize: '0.85rem' }}>Mark Complete</button>
            </div>
          ))}
          {pendingTasks.length === 0 && !loading && <p style={{ color: 'var(--text-muted)' }}>No pending tasks.</p>}
        </div>

        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#10B981' }}>
            <CheckCircle size={20} /> Completed Tasks ({completedTasks.length})
          </h3>
          {completedTasks.map(task => (
            <div key={task._id} className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7 }}>
              <div>
                <h4 style={{ marginBottom: '0.25rem', textDecoration: 'line-through' }}>✅ {task.title}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
              </div>
              <button className="btn btn-secondary" onClick={() => toggleTask(task)} style={{ fontSize: '0.85rem' }}>Undo</button>
            </div>
          ))}
          {completedTasks.length === 0 && !loading && <p style={{ color: 'var(--text-muted)' }}>No completed tasks.</p>}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
