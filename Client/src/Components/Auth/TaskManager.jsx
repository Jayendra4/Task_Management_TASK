import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [user, setUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  // Fetch user info and tasks
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    fetchTasks();
  }, [searchTerm, filterStatus]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Please login to continue', 'error');
        return;
      }

      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filterStatus !== 'all') queryParams.append('status', filterStatus);

      const response = await fetch(`http://localhost:7000/api/tasks?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        showToast('Failed to fetch tasks', 'error');
      }
    } catch (error) {
      showToast('Error fetching tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    const toast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const url = showEditModal 
        ? `http://localhost:7000/api/tasks/edit/${selectedTask._id}`
        : 'http://localhost:7000/api/tasks/add';
      
      const method = showEditModal ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showToast(showEditModal ? 'Task updated successfully!' : 'Task added successfully!');
        resetForm();
        fetchTasks();
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      showToast('Error occurred', 'error');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:7000/api/tasks/delete/${selectedTask._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Task deleted successfully!');
        setShowDeleteModal(false);
        fetchTasks();
      } else {
        showToast(data.message || 'Failed to delete task', 'error');
      }
    } catch (error) {
      showToast('Error deleting task', 'error');
    }
  };

  const toggleTaskStatus = async (task) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:7000/api/tasks/toggle/${task._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Task status updated!');
        fetchTasks();
      } else {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      showToast('Error updating status', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedTask(null);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const getPriorityClass = (priority) => {
    return `${priority}-priority`;
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="task-manager-container">
      {/* Header */}
      <div className="header-section">
        <h1>Task Manager</h1>
        <p>Organize your work and boost your productivity</p>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="controls-grid">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search tasks by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Tasks
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </button>
          </div>

          <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
            <span>➕</span> Add Task
          </button>
        </div>
      </div>

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
          <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
            <span>➕</span> Create Your First Task
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div 
              key={task._id} 
              className={`task-card ${task.status} ${getPriorityClass(task.priority)}`}
            >
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <span className={`task-status ${getStatusClass(task.status)}`}>
                  {task.status}
                </span>
              </div>
              
              <p className="task-description">{task.description}</p>
              
              <div className="task-meta">
                <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
              </div>
              
              <div className="task-actions">
                <button 
                  className="task-btn btn-complete"
                  onClick={() => toggleTaskStatus(task)}
                >
                  {task.status === 'pending' ? '✓ Complete' : '↩ Reopen'}
                </button>
                <button 
                  className="task-btn btn-edit"
                  onClick={() => openEditModal(task)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="task-btn btn-delete"
                  onClick={() => openDeleteModal(task)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Task Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {showEditModal ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form className="task-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter task title..."
                />
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter task description..."
                />
              </div>
              
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {showEditModal ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTask && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Task</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            
            <p>Are you sure you want to delete the task "<strong>{selectedTask.title}</strong>"?</p>
            <p>This action cannot be undone.</p>
            
            <div className="form-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleDelete}>
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'warning' && '⚠️'}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
