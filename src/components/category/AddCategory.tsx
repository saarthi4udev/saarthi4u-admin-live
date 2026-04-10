import React, { useState } from 'react';
import { createCategory } from '../../api/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../college/ConfirmModal';
import ReactQuill from 'react-quill';

const AddCategory: React.FC = () => {
    const [data, setData] = useState({
        name: '',
        description: '',
        visible: true,
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

        if (!data.name || !data.description) {
            toast.error('Name and Description are required', {
                duration: 4000,
                position: 'top-right',
            });
            return;
        }

        await createCategory(data)
            .then((res) => {
                console.log(res);
                toast.success('Category Created Successfully', {
                    duration: 4000,
                    position: 'top-right',
                });
                setTimeout(() => {
                    globalThis.location.href = '/categories';
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

    return (
        <div className="admin-section-card mx-auto w-full max-w-3xl">
            <div>
                <h2 className="admin-section-title">Add New Category</h2>
                <p className="mt-1 text-sm text-body">Create and control visible categories for the website catalog.</p>
            </div>

            <div className="admin-form-grid">
                <div>
                    <label className="admin-label" htmlFor="name">Category Name</label>
                    <input
                        className="admin-input"
                        type="text"
                        id="name"
                        placeholder="Enter category name"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="admin-label" htmlFor="description">Description</label>
                    <ReactQuill
                        theme="snow"
                        value={data.description}
                        placeholder="Write a detailed description"
                        onChange={(value) =>
                            setData((prev: any) => ({
                                ...prev,
                                description: value,
                            }))
                        }
                        className="bg-white mb-4 text-black"
                    />
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-black dark:text-white">
                    <input
                        type="checkbox"
                        checked={data.visible}
                        onChange={(e) => setData({ ...data, visible: e.target.checked })}
                    />
                    Visible on website
                </label>

                <div className="pt-1">
                    <button className="admin-btn-primary" type="submit" onClick={() => setShowModal(true)}>
                        Create Category
                    </button>
                </div>
            </div>

            {showModal &&
                <ConfirmModal setShowModal={setShowModal} handleCreate={handleClick} />
            }
        </div>
    );
};

export default AddCategory;
