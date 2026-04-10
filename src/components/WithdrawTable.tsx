import React, { useState } from 'react';
import SearchFilter from './SearchFilter';
import { getAllWithdrawApprove, getAllWithdrawTranscation } from '../api/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const WithdrawTable = () => {
  const { user } = useAuth();

  const [data, setData] = useState([]);
  const [duplicatedata, setduplicatedata] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransactionData, setSelectedTransactionData] = useState({
    _id: '',
    paymentDetails: {
      email: '',
      quantity: 0,
      session_id: '',
      status: '',
      panCardImage: '',
      total_price: 0,
      coins: 0,
      type: '',
      date: '',
      accountNo: '',
      bankAddress: '',
      ifscCode: '',
      swiftCode: '',
      user_id: '',
      bankName: '',
      _id: '',
      password: '',
    },
  });

  // Function to open the modal for a specific user based on their _id
  const openModalForTransaction = (transactionId: any) => {
    console.log(transactionId);
    const user1: any = data.find((user: any) => user._id === transactionId);
    setSelectedTransactionData(user1);
    setShowModal(true);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await getAllWithdrawTranscation();
      setData(result.data.docs);
      setduplicatedata(result.data.docs);
      console.log(result.data.docs);
    };
    fetchData();
  }, []);

  const handleCancel = (query: string) => {
    if (query) {
      setData(duplicatedata);
    }
  };
  const handleChange = (query: string) => {
    if (query.length == 1) {
      setData(duplicatedata);
      return;
    }
    const filteredData = data.filter((item: any) =>
      item.email.toLowerCase().includes(query.toLowerCase()),
    );
    setData(filteredData);
  };

  const setApprove = async (quantity: any, user_id: any, _id: string) => {
    if (user && user.role === "super") {
      await getAllWithdrawApprove(quantity, user_id, _id)
        .then((res) => {
          if (res.data.success) {
            window.location.reload();
          } else {
            alert('withdraw Limit exceed ');
          }
          setShowModal(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    } else {
      toast.error('You are not a Super admin');
    }
  };

  return (
    <>
      <SearchFilter handleChange={handleChange} onSearch={handleCancel} />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-3">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  User Email
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Quantity
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Request Date
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Amount
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((transactionData: any, index: any) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {transactionData.paymentDetails.name}
                    </h5>
                    <p className="text-sm">
                      {transactionData.paymentDetails.email}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-fullbg-opacity-10 py-1 px-3 text-sm font-medium">
                      {transactionData.paymentDetails.quantity}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-fullbg-opacity-10 py-1 px-3 text-sm font-medium">
                      {new Date(
                        transactionData.paymentDetails.date,
                      ).toLocaleString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-fullbg-opacity-10 py-1 px-3 text-sm font-medium">
                      ${transactionData.paymentDetails.quantity}
                    </p>
                  </td>
                  {transactionData.paymentDetails.status === 'payed' ? (
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                        Paid
                      </p>
                    </td>
                  ) : (
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="inline-flex rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                        Not-Approve
                      </p>
                    </td>
                  )}
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        className="hover:text-primary"
                        onClick={() =>
                          openModalForTransaction(transactionData._id)
                        }
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </button>
                      {showModal && selectedTransactionData && (
                        <>
                          {console.log(selectedTransactionData)}
                          {/* Modal code */}
                          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-95 my-6 mx-auto max-w-3xl">
                              {/* content */}
                              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/* header */}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                  <h3 className="text-2xl font-semibold">
                                    Transaction Details
                                  </h3>
                                  <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={() => setShowModal(false)}
                                  >
                                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                      ×
                                    </span>
                                  </button>
                                </div>
                                {/* body */}
                                <div className="relative p-4">
                                  <div className="panel panel-primary">
                                    <div
                                      className="panel-heading"
                                      style={{ textAlign: 'center' }}
                                    >
                                      <h3 className="panel-title">
                                        {
                                          selectedTransactionData.paymentDetails
                                            .email
                                        }
                                      </h3>
                                    </div>
                                    <div className="panel-body">
                                      <div className="row1">
                                        <div className="allData col-md-9 col-lg-9">
                                          {/* Display individual fields */}

                                          <div>
                                            <strong>Email:</strong>{' '}
                                            {
                                              selectedTransactionData
                                                .paymentDetails.email
                                            }
                                          </div>
                                          <div>
                                            <strong>Quantity:</strong>{' '}
                                            {
                                              selectedTransactionData
                                                .paymentDetails.quantity
                                            }
                                          </div>

                                          <div>
                                            <strong>Status:</strong>{' '}
                                            {
                                              selectedTransactionData
                                                .paymentDetails.status
                                            }
                                          </div>
                                          <div>
                                            <strong>Total Price:</strong>{' '}
                                            {
                                              selectedTransactionData
                                                .paymentDetails.total_price
                                            }
                                          </div>
                                          <div>
                                            <strong>Type:</strong>{' '}
                                            {
                                              selectedTransactionData
                                                .paymentDetails.type
                                            }
                                          </div>
                                          <div>
                                            <strong>Withdraw Date:</strong>{' '}
                                            {new Date(
                                              selectedTransactionData.paymentDetails.date,
                                            ).toLocaleString()}
                                          </div>
                                          <div>
                                            <strong>User coin(total):</strong>{' '}
                                            {
                                              selectedTransactionData
                                                .paymentDetails.coins
                                            }
                                          </div>
                                          <div>
                                            <strong>Bank Name:</strong>{' '}
                                            {
                                              selectedTransactionData
                                                .paymentDetails?.bankName
                                            }
                                          </div>
                                          <div>
                                            <strong>Account No:</strong>{' '}
                                            {
                                              selectedTransactionData
                                                .paymentDetails?.accountNo
                                            }
                                          </div>
                                          <div>
                                            <strong>IFSC Code:</strong>{' '}
                                            {
                                              selectedTransactionData
                                                .paymentDetails?.ifscCode
                                            }
                                          </div>
                                          <div>
                                            <strong>Swift Code:</strong>{' '}
                                            {
                                              selectedTransactionData
                                                .paymentDetails?.swiftCode
                                            }
                                          </div>
                                          <div>
                                            <strong>Swift Code:</strong>{' '}
                                            <a
                                              href={
                                                selectedTransactionData
                                                  .paymentDetails?.panCardImage
                                              }
                                              target="_blank"
                                            >
                                              Click here
                                            </a>
                                          </div>

                                          {/* <div>
                                            <strong>ID:</strong>{' '}
                                            {selectedTransactionData._id}
                                          </div> */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* footer */}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                  {selectedTransactionData.paymentDetails.status === 'payed'
                                    ?
                                    <></>
                                    :
                                    <button
                                      className="text-success background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setApprove(
                                          selectedTransactionData.paymentDetails
                                            .quantity,
                                          selectedTransactionData.paymentDetails
                                            ._id,
                                          selectedTransactionData._id,
                                        )
                                      }
                                      }
                                    >
                                      Approve
                                    </button>
                                  }
                                  <button
                                    className="text-danger background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default WithdrawTable;
