import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import '../styles/UserManagement.css';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserManagement: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const usersPerPage = 5;
  const totalPages = Math.ceil(users.length / usersPerPage);

  const sortedUsers = [...users].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const onSubmit = (data: User) => {
    if (editId !== null) {
      setUsers(users.map(user => user.id === editId ? { ...user, ...data } : user));
      setEditId(null);
    } else {
      setUsers([...users, { ...data, id: Date.now() }]);
    }
    reset();
  };

  const onEdit = (id: number) => {
    const user = users.find(user => user.id === id);
    if (user) {
      reset(user);
      setEditId(id);
    }
  };

  const onDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="user-management">
      <h1>User Management Dashboard</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="user-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" {...register('name', { required: 'Name is required' })} />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, 
                message: 'Invalid email format'
              }
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <button type="submit">{editId !== null ? 'Update User' : 'Add User'}</button>
      </form>

      <table className="user-table">
        <thead>
          <tr>
            <th onClick={handleSort} className="sortable">Name {sortOrder === 'asc' ? '⬆️' : '⬇️'}</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => onEdit(user.id)}>Edit</button> <span></span>
                <button onClick={() => onDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;