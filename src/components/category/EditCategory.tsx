import { useEffect, useState } from 'react';
import { getCategoryById, updateCategory } from '../../api/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../college/ConfirmModal';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';

export default function EditCategory() {
    const [data, setData] = useState<any>(null);
    const { id } = useParams<any>();

    useEffect(() => {
        getCategoryById(id)
            .then((res) => {
                console.log(res.data.data);
                setData(res.data.data);
            })
            .catch(() => toast.error("Failed to load category"));
    }, [id]);

    const handleChange = (e: any) => {
        const { id, value, type, checked } = e.target;
        setData({
            ...data,
            [id]: type === "checkbox" ? checked : value,
        });
    };

    const [showModal, setShowModal] = useState(false);

    const handleClick = async (e: any) => {
        e.preventDefault();

        if (!data.name || !data.description) {
            toast.error('Name and Description are required', {
                duration: 4000,
                position: 'top-right',
            });
            return;
        }

        await updateCategory(id, {
            name: data.name,
            description: data.description,
            visible: data.visible,
        })
            .then((res) => {
                console.log(res);
                toast.success('Category Updated Successfully', {
                    duration: 4000,
                    position: 'top-right',
                });
                setTimeout(() => {
                    globalThis.location.href = '/category';
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
                toast.error(
                    err?.message || 'Category Creation Failed. Please try again.',
                    {
                        duration: 4000,
                        position: 'top-right',
                    },
                );
            });
    };

    if (!data) return <p>Loading...</p>;


    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                <div className="flex w-full flex-wrap gap-3 sm:gap-5">
                    <div className="flex min-w-47.5">
                        <div className="w-full">
                            <p
                                className="font-bold text-secondary"
                                style={{ fontSize: '27px' }}
                            >
                                Edit Category "{data.name || ""}""
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Admin Form  */}
            <div>
                <div className="add-adminForm">
                    <label className="add-adminLabel" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="add-adminInput"
                        type="name"
                        value={data.name || ""}
                        id="name"
                        placeholder="Name"
                        onChange={(e) => handleChange(e)}
                        required
                    />

                    <label className="add-adminLabel" htmlFor="email">
                        Description
                    </label>
                    <ReactQuill
                        theme="snow"
                        value={data.description}
                        placeholder="Enter detailed description"
                        onChange={(value) =>
                            setData((prev: any) => ({
                                ...prev,
                                description: value,
                            }))
                        }
                        className="bg-white mb-4 text-black"
                    />

                    {/* Visible */}
                    <div className="flex items-center gap-2 mt-3">
                        <input
                            type="checkbox"
                            checked={data.visible}
                            id='visible'
                            onChange={(e) =>
                                setData({ ...data, visible: e.target.checked })
                            }
                        />
                        <label>Visible</label>
                    </div>

                    <button
                        className="add-adminButton"
                        type="submit"
                        onClick={() => setShowModal(true)}
                    >
                        Update Category
                    </button>
                    {showModal &&
                        <ConfirmModal setShowModal={setShowModal} handleCreate={handleClick} />
                    }
                </div>
            </div>
        </div>
    );
};

