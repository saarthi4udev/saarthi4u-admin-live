import React, { useState } from 'react';
import { getTopUsers } from '../api/api';

const TableOne = () => {
  const [data, setData] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await getTopUsers();
      console.log(result.data.topUsers);

      setData(result.data.topUsers);
    };
    fetchData();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-3">
      <h1 className='mb-4' style={{ fontSize: '1.4rem' }}>Top Investors</h1>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Coins
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user: any, index: any) => (
              <tr key={index}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {user.name}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="inline-flex rounded-fullbg-opacity-10 py-1 px-3 text-sm font-medium">
                    {user.email}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="inline-flex rounded-fullbg-opacity-10 py-1 px-3 text-sm font-medium">
                    {user.coins}
                  <svg
                    className="fill-meta-3 ml-1 mt-1"
                    width="10"
                    height="11"
                    viewBox="0 0 10 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                      fill=""
                    />
                  </svg>
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableOne;
