import React, { useReducer, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheck, FaCheckSquare } from 'react-icons/fa';

const initialState = JSON.parse(localStorage.getItem('tasks')) || [];

function taskReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [
        ...state,
        {
          id: Date.now(),
          text: action.text,
          completed: false,
          dateAdded: new Date().toLocaleString('en-US', 
          { 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: true 
          }),
          dateEdited: null
        }
      ];
    case 'delete':
      return state.filter(task => task.id !== action.id);
    case 'complete':
      return state.map(task =>
        task.id === action.id ? { ...task, completed: !task.completed } : task
      );
    case 'edit':
      return state.map(task =>
        task.id === action.id ? { ...task, text: action.text, dateEdited: 
          new Date().toLocaleString('en-US', 
          { 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: true 
          }) } : task
      );
    default:
      return state;
  }
}

function TaskList() {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [newTask, setNewTask] = React.useState('');
  const [editing, setEditing] = React.useState(null);
  const [editedText, setEditedText] = React.useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state));
  }, [state]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      dispatch({ type: 'add', text: newTask });
      setNewTask('');
    }
  };

  const saveEdit = (id) => {
    dispatch({ type: 'update', id: id, text: editedText });
    setEditing(null);
    setEditedText('');
  };

  return (
    <div className="task-list">
      <h2>Task</h2>
      <div className="task-input-group">
        <input 
          className="task-input" 
          value={newTask} 
          onChange={e => setNewTask(e.target.value)} 
        />
        <button className="task-button" onClick={addTask}>Add task</button>
      </div>
      {[...state].reverse().map(task => (
        <div 
          key={task.id} 
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          {editing === task.id ? (
            <>
              <input 
                className="task-input"
                value={editedText} 
                onChange={e => setEditedText(e.target.value)} 
              />
              <FaCheckSquare 
                className="task-icon" 
                onClick={() => saveEdit(task.id)} 
              />
            </>
          ) : (
            <span className="task-text">{task.text}</span>
          )}
          <div className="task-icons">
            <FaCheck 
              className={`task-icon ${task.completed ? 'completed' : ''}`} 
              onClick={() => dispatch({ type: 'complete', id: task.id })} 
            />
            <FaEdit 
              className="task-icon" 
              onClick={() => { setEditing(task.id); setEditedText(task.text); }} 
            />
            <FaTrash 
              className="task-icon" 
              onClick={() => dispatch({ type: 'delete', id: task.id })}
            />
          </div>
          <div className="task-dates">
            <span>{task.dateAdded}</span>
            {task.dateEdited && <span>{task.dateEdited}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;