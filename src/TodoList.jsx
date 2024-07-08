import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortType, setSortType] = useState('default'); // 'default' or 'alphabetical'

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTasks([...tasks, { text: input, completed: false }]);
      setInput('');
    }
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleCompletion = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const handleSortChange = (type) => {
    setSortType(type);
  };

  const getSortedTasks = () => {
    switch (sortType) {
      case 'alphabetical':
        return [...tasks].sort((a, b) => a.text.localeCompare(b.text));
      default:
        // Default to sort by task addition time (array index)
        return [...tasks];
    }
  };

  const filteredTasks = getSortedTasks().filter((task) =>
    filter === 'all'
      ? true
      : filter === 'completed'
      ? task.completed
      : !task.completed
  );

  return (
    <div className="todo-list">
      <h1>To-Do List</h1>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <div className="sort">
        <label>Sort by:</label>
        <select value={sortType} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="default">Default (by time added)</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
      <ul>
        {filteredTasks.map((task, index) => (
          <li key={index} className={task.completed ? 'completed' : ''}>
            <span onClick={() => toggleCompletion(index)}>{task.text}</span>
            <button onClick={() => removeTask(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
