import React, { useState } from 'react';
import { createAdmin } from '../api/api';
import toast from 'react-hot-toast';
import ConfirmModal from './college/ConfirmModal';

const AddAdmin: React.FC = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const [showModal, setShowModal] = useState(false);

  const handleClick = async (e: any) => {
    e.preventDefault();

    await createAdmin(data.name, data.email, data.password)
      .then((res) => {
        console.log(res);
        toast.success('Admin Created Successfully', {
          duration: 4000,
          position: 'top-right',
        });
        globalThis.location.href = '/admin';
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          'Admin Creation Failed. Please check your credentials and try again.',
          {
            duration: 4000,
            position: 'top-right',
          },
        );
      });
  };

  return (
    <div className="admin-section-card mx-auto w-full max-w-3xl">
      <div>
        <h2 className="admin-section-title">Add New Admin</h2>
        <p className="mt-1 text-sm text-body">Create admin access for your team with a secure account setup.</p>
      </div>

      <div className="admin-form-grid">
        <div>
          <label className="admin-label" htmlFor="name">Name</label>
          <input className="admin-input" type="text" id="name" placeholder="Enter full name" onChange={handleChange} required />
        </div>

        <div>
          <label className="admin-label" htmlFor="email">Email</label>
          <input className="admin-input" type="email" id="email" placeholder="Enter email address" onChange={handleChange} required />
        </div>

        <div>
          <label className="admin-label" htmlFor="password">Password</label>
          <input className="admin-input" type="password" id="password" placeholder="Enter strong password" onChange={handleChange} required />
          <p className="mt-1 text-xs text-body">Use at least 8 characters with letters and numbers.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button className="admin-btn-primary" type="submit" onClick={() => setShowModal(true)}>
            Create Admin
          </button>
          <button
            className="admin-btn-outline"
            type="button"
            onClick={() => {
              globalThis.location.href = '/admin';
            }}
          >
            Go to Admin List
          </button>
        </div>
      </div>

      {showModal && <ConfirmModal setShowModal={setShowModal} handleCreate={handleClick} />}
    </div>
  );
};

export default AddAdmin;
