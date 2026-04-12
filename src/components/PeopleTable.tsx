import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { updateRole } from '../api/api';
import { useAuth } from '../context/AuthContext';
import SearchFilter from './SearchFilter';

interface UserRecord {
  id: number;
  name?: string;
  email?: string;
  role?: string;
  authProvider?: string;
  loginProvider?: string;
  phone?: string;
  phoneNo?: string;
  address?: string;
  isActive?: boolean;
  dateOfJoining?: string;
  updatedAt?: string;
}

interface PeopleTableProps {
  fetchAction: () => Promise<any>;
}

const PeopleTable = ({ fetchAction }: PeopleTableProps) => {
  const { user } = useAuth();

  const [records, setRecords] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<UserRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchAction();
      const rows = result?.data?.data || [];
      setRecords(rows);
    } catch {
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchData();
  }, [fetchAction]);

  const canEditRole = useMemo(() => user?.role === 'admin', [user]);

  const handleRoleSelect = async (event: React.ChangeEvent<HTMLSelectElement>, userId: number) => {
    const role = event.target.value;

    try {
      const result = await updateRole(userId, role);
      if (result.status === 200) {
        toast.success('Role updated successfully');
        setRecords((prev) => prev.map((row) => (row.id === userId ? { ...row, role } : row)));
      } else {
        toast.error('Role update failed');
      }
    } catch {
      toast.error('Role update failed');
    }
  };

  const handleChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCancel = (query: string) => {
    if (query) {
      setSearchQuery('');
    }
  };

  const visibleRows = useMemo(() => {
    return records.filter((item) => {
      const email = (item.email || '').toLowerCase();
      const matchesSearch = searchQuery.length <= 1 || email.includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || (item.role || '').toLowerCase() === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [records, roleFilter, searchQuery]);

  const totalCount = records.length;
  const adminCount = records.filter((item) => (item.role || '').toLowerCase() === 'admin').length;
  const userCount = records.filter((item) => (item.role || '').toLowerCase() === 'user').length;
  const activeCount = records.filter((item) => item.isActive).length;

  const totalPages = Math.ceil(visibleRows.length / rowsPerPage);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return visibleRows.slice(start, start + rowsPerPage);
  }, [visibleRows, currentPage, rowsPerPage]);

  const mappedSelected = selectedRecord
    ? {
      name: selectedRecord.name || 'N/A',
      email: selectedRecord.email || 'N/A',
      phone: selectedRecord.phone || selectedRecord.phoneNo || 'N/A',
      role: selectedRecord.role || 'N/A',
      authProvider: selectedRecord.authProvider || selectedRecord.loginProvider || 'N/A',
      address: selectedRecord.address || 'N/A',
      isActive: selectedRecord.isActive ? 'Active' : 'Inactive',
      dateOfJoining: selectedRecord.dateOfJoining || 'N/A',
      updatedAt: selectedRecord.updatedAt
        ? new Date(selectedRecord.updatedAt).toLocaleString()
        : 'N/A',
    }
    : null;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  return (
    <>
      <div className="mb-4 rounded-2xl border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-xl bg-gray-2/60 px-3 py-2 dark:bg-meta-4/30">
              <p className="text-xs uppercase tracking-wide text-body">Total</p>
              <p className="text-xl font-semibold text-black dark:text-white">{totalCount}</p>
            </div>
            <div className="rounded-xl bg-gray-2/60 px-3 py-2 dark:bg-meta-4/30">
              <p className="text-xs uppercase tracking-wide text-body">Admins</p>
              <p className="text-xl font-semibold text-black dark:text-white">{adminCount}</p>
            </div>
            <div className="rounded-xl bg-gray-2/60 px-3 py-2 dark:bg-meta-4/30">
              <p className="text-xs uppercase tracking-wide text-body">Users</p>
              <p className="text-xl font-semibold text-black dark:text-white">{userCount}</p>
            </div>
            <div className="rounded-xl bg-gray-2/60 px-3 py-2 dark:bg-meta-4/30">
              <p className="text-xs uppercase tracking-wide text-body">Active</p>
              <p className="text-xl font-semibold text-black dark:text-white">{activeCount}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setRoleFilter('all')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${roleFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-2 text-body hover:bg-primary/10 dark:bg-meta-4/40'}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('admin')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${roleFilter === 'admin' ? 'bg-primary text-white' : 'bg-gray-2 text-body hover:bg-primary/10 dark:bg-meta-4/40'}`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('user')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${roleFilter === 'user' ? 'bg-primary text-white' : 'bg-gray-2 text-body hover:bg-primary/10 dark:bg-meta-4/40'}`}
            >
              User
            </button>
            <button type="button" onClick={fetchData} className="admin-btn-outline">
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <SearchFilter handleChange={handleChange} onSearch={handleCancel} />

      <div className="admin-table-wrap">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-2 text-black dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="admin-table-th min-w-[220px] xl:pl-8">Name & Email</th>
                <th className="admin-table-th min-w-[130px]">Role</th>
                <th className="admin-table-th min-w-[140px]">Phone</th>
                <th className="admin-table-th min-w-[140px]">Login Provider</th>
                <th className="admin-table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-body">
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedRows.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-2/30 dark:hover:bg-meta-4/30">
                    <td className="admin-table-td xl:pl-8">
                      <h5 className="font-medium text-black dark:text-white">{record.name || 'N/A'}</h5>
                      <p className="text-xs text-body">{record.email || 'N/A'}</p>
                    </td>

                    <td className="admin-table-td">
                      {canEditRole ? (
                        <select
                          className="admin-input py-2"
                          name="role"
                          value={record.role || 'user'}
                          onChange={(event) => handleRoleSelect(event, record.id)}
                        >
                          <option value="admin">admin</option>
                          <option value="user">user</option>
                        </select>
                      ) : (
                        <span className="admin-tag capitalize">{record.role || 'N/A'}</span>
                      )}
                    </td>

                    <td className="admin-table-td">{record.phone || record.phoneNo || 'Phone not provided'}</td>
                    <td className="admin-table-td">{record.authProvider || record.loginProvider || 'N/A'}</td>

                    <td className="admin-table-td">
                      <button
                        className="admin-btn-outline"
                        onClick={() => setSelectedRecord(record)}
                        type="button"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
            <div className="text-sm text-body">
              Page {currentPage} of {totalPages || 1}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="admin-btn-outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${currentPage === page ? 'bg-primary text-white' : 'bg-gray-2'
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                className="admin-btn-outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>

            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="admin-input"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {mappedSelected && (
        <>
          <div className="admin-modal-overlay" onClick={() => setSelectedRecord(null)}></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="admin-modal-card">
              <div className="flex items-center justify-between border-b border-stroke px-5 py-4 dark:border-strokedark">
                <h3 className="text-lg font-semibold text-black dark:text-white">User Details</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-2xl leading-none text-body hover:text-danger"
                  type="button"
                >
                  &times;
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-5">
                <table className="w-full text-sm">
                  <tbody>
                    <tr><td className="py-1 font-medium text-body">Name</td><td>{mappedSelected.name}</td></tr>
                    <tr><td className="py-1 font-medium text-body">Email</td><td>{mappedSelected.email}</td></tr>
                    <tr><td className="py-1 font-medium text-body">Phone</td><td>{mappedSelected.phone}</td></tr>
                    <tr><td className="py-1 font-medium text-body">Role</td><td className="capitalize">{mappedSelected.role}</td></tr>
                    <tr><td className="py-1 font-medium text-body">Auth Provider</td><td>{mappedSelected.authProvider}</td></tr>
                    <tr><td className="py-1 font-medium text-body">Address</td><td>{mappedSelected.address}</td></tr>
                    <tr><td className="py-1 font-medium text-body">Status</td><td>{mappedSelected.isActive}</td></tr>
                    <tr><td className="py-1 font-medium text-body">Joined On</td><td>{mappedSelected.dateOfJoining}</td></tr>
                    <tr><td className="py-1 font-medium text-body">Last Updated</td><td>{mappedSelected.updatedAt}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end border-t border-stroke px-5 py-3 dark:border-strokedark">
                <button onClick={() => setSelectedRecord(null)} className="admin-btn-primary" type="button">
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PeopleTable;
