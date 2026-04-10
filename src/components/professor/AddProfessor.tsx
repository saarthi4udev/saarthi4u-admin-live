import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../college/ConfirmModal";

import { createProfessor } from "../../api/api";

const AddProfessor: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const [data, setData] = useState({
        name: "",
        title: "",
        description: "",
        role: "",
        experienceYears: "",
        qualifications: "",
        studentsGuided: "",
        rating: "",
        totalReviews: "",
        shortQualifications: "",
    });
    const [profileImageUrl, setProfileImageUrl] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            // Revoke the object URL to free memory when component unmounts or image changes
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setData((prev) => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImageUrl(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreate = async () => {
        if (!data.name.trim()) { toast.error("Name is required"); return; }
        if (!data.title.trim()) { toast.error("Title is required"); return; }
        if (!profileImageUrl) { toast.error("Photo is required"); return; }

        const ratingNum = Number.parseFloat(data.rating);

        if (Number.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
            toast.error("Rating must be between 0 and 5");
            return;
        }

        try {
            // 🔥 Transform UI → Backend format
            const payload = {
                name: data.name,
                title: data.title,
                role: data.role || "Professor", // default to "Professor" if role is not provided

                rating: ratingNum,
                qualifications: data.qualifications,
                totalReviews: data.totalReviews ? Number.parseInt(data.totalReviews) : 0,
                experienceYears: data.experienceYears ? Number.parseInt(data.experienceYears) : 0,
                studentsGuided: data.studentsGuided
                    ? Number.parseInt(data.studentsGuided.replaceAll(/[^0-9]/g, ""))
                    : 0,

                // optional (if backend supports)
                description: data.description,
                shortQualifications: data.shortQualifications ? Number.parseInt(data.shortQualifications) : 0,
            };

            const formData = new FormData();
            formData.append("profileImage", profileImageUrl);
            // Append other fields to formData
            formData.append("name", payload.name);
            formData.append("title", payload.title);
            formData.append("role", payload.role);
            formData.append("rating", payload.rating.toString());
            formData.append("totalReviews", payload.totalReviews.toString());
            formData.append("experienceYears", payload.experienceYears.toString());
            formData.append("studentsGuided", payload.studentsGuided.toString());
            formData.append("description", payload.description);
            formData.append("qualifications", payload.qualifications);
            formData.append("shortQualifications", payload.shortQualifications.toString());

            console.log("Payload:", payload);

            await createProfessor(formData); // ✅ API CALL

            toast.success("Professor Added Successfully");

            setShowModal(false);

            // reset form
            setData({
                name: "", title: "", description: "", experienceYears: "",
                studentsGuided: "", rating: "", totalReviews: "",
                role: "", shortQualifications: "",
                qualifications: ""
            });

            setImagePreview(null);
            setProfileImageUrl(null);

        } catch (err: any) {
            toast.error(err.message || "Failed to add professor");
        }
    };

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">
                Add New Professor
            </p>

            <div className="add-adminForm">

                {/* Name */}
                <label className="add-adminLabel">Name *</label>
                <input
                    className="add-adminInput"
                    id="name"
                    value={data.name}
                    maxLength={100}
                    placeholder="Enter professor name (max 100 chars)"
                    onChange={handleChange}
                />
                <p className="text-xs text-gray-400 -mt-2 mb-2">{data.name.length}/100</p>

                {/* Title */}
                <label className="add-adminLabel">Title *</label>
                <input
                    className="add-adminInput"
                    id="title"
                    value={data.title}
                    maxLength={150}
                    placeholder="e.g., Assistant Professor / HOD"
                    onChange={handleChange}
                />
                <p className="text-xs text-gray-400 -mt-2 mb-2">{data.title.length}/150</p>

                {/* Photo */}
                <label className="add-adminLabel">Profile Image *</label>
                <input
                    type="file"
                    className="add-adminInput"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {/* ✅ Logo Preview */}
                {imagePreview && (
                    <div className="mt-2 mb-4 relative w-fit">
                        <img
                            src={imagePreview}
                            alt="Default Preview"
                            className="h-24 w-24 rounded-md object-contain border border-gray-300 bg-gray-50"
                        />
                        <button
                            type="button"
                            onClick={() => { setProfileImageUrl(null); setImagePreview(null); }}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* description */}
                <label className="add-adminLabel">Description</label>
                <textarea
                    id="description"
                    value={data.description}
                    maxLength={500}
                    rows={4}
                    placeholder="Enter professor description (max 500 chars)"
                    onChange={handleChange}
                    className="add-adminInput"
                ></textarea>
                <p className="text-xs text-gray-400 -mt-2 mb-2">{data.description.length}/500</p>

                {/* Qualifications */}
                <label className="add-adminLabel">Qualifications</label>
                <input
                    className="add-adminInput"
                    id="qualifications"
                    value={data.qualifications}
                    placeholder="e.g., PhD in Computer Science"
                    onChange={handleChange}
                />

                {/* Role */}
                <label className="add-adminLabel">Role</label>
                <input
                    className="add-adminInput"
                    id="role"
                    value={data.role}
                    placeholder="e.g., Professor"
                    onChange={handleChange}
                />

                {/* Experience in Years */}
                <label className="add-adminLabel">Experience in Years</label>
                <input
                    className="add-adminInput"
                    id="experienceYears"
                    value={data.experienceYears}
                    placeholder="e.g., 10 Yrs"
                    onChange={handleChange}
                />

                {/* Students Guided */}
                <label className="add-adminLabel">Students Guided</label>
                <input
                    className="add-adminInput"
                    id="studentsGuided"
                    value={data.studentsGuided}
                    placeholder="e.g., 1,900+"
                    onChange={handleChange}
                />

                {/* Rating */}
                <label className="add-adminLabel">Rating (0–5)</label>
                <input
                    className="add-adminInput"
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={data.rating}
                    placeholder="e.g., 4.9"
                    onChange={handleChange}
                />

                {/* Reviews Count */}
                <label className="add-adminLabel">Reviews Count</label>
                <input
                    className="add-adminInput"
                    id="totalReviews"
                    type="number"
                    min="0"
                    value={data.totalReviews}
                    placeholder="Total number of reviews"
                    onChange={handleChange}
                />

                {/* Qualifications in Short */}
                <label className="add-adminLabel">Qualifications in Short</label>
                <input
                    className="add-adminInput"
                    id="shortQualifications"
                    value={data.shortQualifications}
                    placeholder="e.g., Phd, 10+ Yrs Exp"
                    onChange={handleChange}
                />

                {/* Submit */}
                <button
                    className="add-adminButton mt-4"
                    onClick={() => setShowModal(true)}
                >
                    Add Professor
                </button>

                {showModal && (
                    <ConfirmModal
                        setShowModal={setShowModal}
                        handleCreate={handleCreate}
                    />
                )}
            </div>
        </div>
    );
};

export default AddProfessor;
