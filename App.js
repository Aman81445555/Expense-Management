import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected import

const API_URL = 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // State for forms
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [expenseForm, setExpenseForm] = useState({ amount: '', currency: 'INR', category: '', description: '', date: '' });
  
  // State for data
  const [pendingExpenses, setPendingExpenses] = useState([]);

  // Effect to get user from token and fetch data
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      const decodedUser = jwtDecode(token).user;
      setUser(decodedUser);

      // Fetch pending expenses if user is a manager or admin
      if (decodedUser.role === 'Admin' || decodedUser.role === 'Manager') {
        fetchPendingExpenses();
      }
    } else {
      localStorage.removeItem('token');
      axios.defaults.headers.common['x-auth-token'] = null;
      setUser(null);
    }
  }, [token]);

  const fetchPendingExpenses = async () => {
    try {
      const res = await axios.get(`${API_URL}/expenses/pending`);
      setPendingExpenses(res.data);
    } catch (err) {
      console.error('Error fetching pending expenses:', err);
    }
  };
  
  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  const handleExpenseChange = (e) => setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/login`, loginForm);
      setToken(res.data.token);
    } catch (err) {
      alert('Login failed. Check console for details.');
      console.error(err);
    }
  };

  const handleLogout = () => setToken(null);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/expenses`, expenseForm);
      alert('Expense submitted successfully!');
      setExpenseForm({ amount: '', currency: 'INR', category: '', description: '', date: '' });
    } catch (err) {
      alert('Expense submission failed. (Did you assign a manager in the database?)');
      console.error(err);
    }
  };

  const handleApprovalAction = async (expenseId, action) => {
    try {
      await axios.put(`${API_URL}/expenses/${expenseId}/${action}`, { comment: `${action}ed by manager.` });
      alert(`Expense ${action}d!`);
      fetchPendingExpenses(); // Refresh the list
    } catch (err) {
      alert('Action failed.');
      console.error(err);
    }
  };


  if (!token) {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input type="email" name="email" placeholder="Email" value={loginForm.email} onChange={handleLoginChange} required />
          <input type="password" name="password" placeholder="Password" value={loginForm.password} onChange={handleLoginChange} required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Expense Management</h1>
      <p>Welcome, {user.role}! <button onClick={handleLogout}>Logout</button></p>
      
      <hr />
      
      <h2>Submit New Expense</h2>
      <form onSubmit={handleExpenseSubmit}>
        <input type="number" name="amount" placeholder="Amount" value={expenseForm.amount} onChange={handleExpenseChange} required />
        <input type="text" name="currency" placeholder="Currency (e.g., USD)" value={expenseForm.currency} onChange={handleExpenseChange} required />
        <input type="text" name="category" placeholder="Category" value={expenseForm.category} onChange={handleExpenseChange} required />
        <input type="text" name="description" placeholder="Description" value={expenseForm.description} onChange={handleExpenseChange} />
        <input type="date" name="date" value={expenseForm.date} onChange={handleExpenseChange} required />
        <button type="submit">Submit Expense</button>
      </form>
      
      <hr />
      
      {(user.role === 'Admin' || user.role === 'Manager') && (
        <div>
          <h2>Pending Approvals</h2>
          {pendingExpenses.length > 0 ? (
            <ul>
              {pendingExpenses.map((exp) => (
                <li key={exp._id}>
                  {exp.description} ({exp.amount} {exp.currency}) - Submitted by: {exp.employee.email}
                  <br/>
                  Converted: {Number(exp.convertedAmount).toFixed(2)} {exp.companyCurrency}
                  <br/>
                  <button onClick={() => handleApprovalAction(exp._id, 'approve')}>Approve</button>
                  <button onClick={() => handleApprovalAction(exp._id, 'reject')}>Reject</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No expenses waiting for your approval.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;