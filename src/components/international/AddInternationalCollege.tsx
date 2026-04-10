import React, { useState } from 'react';
import { createInternationalCollege } from '../../api/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../college/ConfirmModal';
import slugify from 'slugify';
import ReactQuill from 'react-quill';

const AddInternationalCollege: React.FC = () => {
    const [data, setData] = useState({
        name: '',
        slug: '',
        description: '',
        location: '',
        visible: true,
    });

    const [showModal, setShowModal] = useState(false);

    const handleChange = (e: any) => {
        const { id, value, type, checked } = e.target;

        setData((prev) => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
            ...(id === "name" && {
                slug: slugify(value, { lower: true, strict: true }),
            }),
        }));
    };

    const handleClick = async (e: any) => {
        e.preventDefault();

        if (!data.name || !data.slug || !data.location) {
            toast.error('Name, Slug and Location are required');
            return;
        }

        try {
            const res = await createInternationalCollege(data);

            if (res.status === 200) {
                toast.success('International College Created Successfully');

                setTimeout(() => {
                    globalThis.location.href = '/international-colleges';
                }, 1000);
            }
        } catch (err: any) {
            toast.error(
                err?.message || 'International College Creation Failed'
            );
        }
    };

    return (
        <div className="admin-section-card mx-auto w-full max-w-3xl">
            <div>
                <h2 className="admin-section-title">
                    Add International College
                </h2>
                <p className="mt-1 text-sm text-body">
                    Create and manage international colleges listing.
                </p>
            </div>

            <div className="admin-form-grid">

                {/* Name */}
                <div>
                    <label className="admin-label">College Name *</label>
                    <input
                        className="admin-input"
                        type="text"
                        id="name"
                        value={data.name}
                        placeholder="e.g. University of Oxford"
                        onChange={handleChange}
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="admin-label">Slug *</label>
                    <input
                        className="admin-input"
                        value={data.slug}
                        readOnly
                        placeholder="Auto-generated from name"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="admin-label">Location *</label>
                    <input
                        className="admin-input"
                        id="location"
                        value={data.location}
                        placeholder="e.g. Oxford, United Kingdom"
                        onChange={handleChange}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="admin-label">Description</label>
                    <ReactQuill
                        theme="snow"
                        value={data.description}
                        placeholder="Write detailed college description..."
                        onChange={(value) =>
                            setData((prev: any) => ({
                                ...prev,
                                description: value,
                            }))
                        }
                        className="bg-white mb-4 text-black"
                    />
                </div>

                {/* Visibility */}
                <label className="inline-flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        id="visible"
                        checked={data.visible}
                        onChange={handleChange}
                    />
                    Visible on website
                </label>

                {/* Submit */}
                <div className="pt-2">
                    <button
                        className="admin-btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        Create International College
                    </button>
                </div>
            </div>

            {showModal && (
                <ConfirmModal
                    setShowModal={setShowModal}
                    handleCreate={handleClick}
                />
            )}
        </div>
    );
};

export default AddInternationalCollege;