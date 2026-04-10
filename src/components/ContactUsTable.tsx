import React from 'react';
import SearchFilter from './SearchFilter';
import { DeleteContactUs, getAllContactUs } from '../api/api';
import toast from 'react-hot-toast';
const ContactUsTable = () => {
  const [data, setData] = React.useState([]);
  const [dupdata, setdupdata] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const result = await getAllContactUs();
      if (typeof result.data.data == 'string') {
        setData([]);
        setdupdata([]);
      } else {
        setData(result.data.data);
        setdupdata(result.data.data);
      }
    };
    fetchData();
  }, []);

  const handleChange = (query: string) => {
    if (query.length == 1) {
      setData(dupdata);
      return;
    }
    const filteredData = data.filter((item: any) =>
      item.message.toLowerCase().includes(query.toLowerCase()),
    );
    setData(filteredData);
  };
  const handleCancel = (query: string) => {
    if (query) {
      setData(dupdata);
    }
  };
  const handleDelete = async (_id: any) => {
    if (globalThis.confirm('Are you sure want to delete?')) {
      await DeleteContactUs(_id).then(() => {
        toast.success('Message deleted');
        setData(data.filter((item: any) => item._id != _id));
      });
    }
  };
  return (
    <>
      <SearchFilter handleChange={handleChange} onSearch={handleCancel} />
      <div className="admin-table-wrap">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-2 text-black dark:bg-meta-4 dark:text-white">
              <tr>
                <th className="admin-table-th min-w-[220px] xl:pl-8">
                  Name
                </th>
                <th className="admin-table-th min-w-[170px]">
                  Email
                </th>
                <th className="admin-table-th min-w-[170px]">
                  Phone
                </th>
                <th className="admin-table-th min-w-[170px]">
                  Subject
                </th>
                <th className="admin-table-th min-w-[220px]">
                  Message
                </th>
                <th className="admin-table-th">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length == 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-body">No data available</td>
                </tr>
              ) : (
                data.length > 0 &&
                data.map((user: any, index: any) => (
                  <tr key={index} className="hover:bg-gray-2/30 dark:hover:bg-meta-4/30">
                    <td className="admin-table-td xl:pl-8">
                      <h5 className="font-medium text-black dark:text-white">
                        {user.name}
                      </h5>
                    </td>
                    <td className="admin-table-td">{user.email}</td>
                    <td className="admin-table-td">{user.phone}</td>
                    <td className="admin-table-td">{user.subject}</td>
                    <td className="admin-table-td">
                      <span className="line-clamp-2">{user.message}</span>
                    </td>
                    <td className="admin-table-td">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(user._id)
                          }}
                          className="rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ContactUsTable;
