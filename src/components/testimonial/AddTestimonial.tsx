import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ConfirmModal from "../college/ConfirmModal";
import { createTestimonial } from "../../api/api"; // ✅ API import

const StarRating: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="text-3xl leading-none focus:outline-none"
                    style={{ color: star <= (hovered || value) ? "#F5A623" : "#D1D5DB" }}
                >
                    ★
                </button>
            ))}
            {value > 0 && (
                <span className="ml-2 self-center text-sm  text-black dark:text-white">
                    {value} / 5
                </span>
            )}
        </div>
    );
};

const AddTestimonial: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState({
        name: "",
        quote: "",
        role: "",
        city: "",
        rating: 0,
    });

    const [avatarUrl, setAvatarUrl] = useState<File | null>(null);
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
            setAvatarUrl(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreate = async () => {
        // ✅ validations
        if (!data.name.trim()) { toast.error("Name is required"); return; }
        if (!data.quote.trim()) { toast.error("Quote is required"); return; }
        if (!data.role.trim()) { toast.error("Role is required"); return; }
        if (!data.city.trim()) { toast.error("City is required"); return; }
        if (!avatarUrl) { toast.error("User Photo is required"); return; }
        if (data.rating < 1 || data.rating > 5) { toast.error("Rating must be 1–5"); return; }

        try {
            // ✅ correct payload for backend
            const payload: any = {
                name: data.name,
                quote: data.quote,
                role: data.role,
                city: data.city,
                rating: Number(data.rating),
            };

            const formData = new FormData();
            formData.append("avatarUrl", avatarUrl);
            formData.append("name", payload.name);
            formData.append("quote", payload.quote);
            formData.append("role", payload.role);
            formData.append("city", payload.city);
            formData.append("rating", payload.rating.toString());


            console.log("FINAL PAYLOAD:", payload);

            await createTestimonial(formData);

            toast.success("Testimonial Added Successfully");

            setShowModal(false);
            setData({
                name: "",
                quote: "",
                role: "",
                city: "",
                rating: 0,
            });

        } catch (err: any) {
            console.error("ERROR:", err?.response?.data || err.message);
            toast.error(err?.response?.data?.message || "Failed to add testimonial");
        }
    };

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">
                Add New Testimonial
            </p>

            <div className="add-adminForm">

                {/* Name */}
                <label className="add-adminLabel">Name *</label>
                <input
                    className="add-adminInput"
                    id="name"
                    value={data.name}
                    placeholder="Enter Name (eg. John Doe)"
                    maxLength={100}
                    onChange={handleChange}
                />

                {/* Avatar */}
                <label className="add-adminLabel">User Photo *</label>
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
                            onClick={() => { setAvatarUrl(null); setImagePreview(null); }}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Quote */}
                <label className="add-adminLabel">Quote *</label>
                <textarea
                    id="quote"
                    value={data.quote}
                    onChange={handleChange}
                    placeholder="Enter quote from user (max 300 chars)"
                    className="add-adminInput"
                />

                {/* Role */}
                <label className="add-adminLabel">Role *</label>
                <input
                    id="role"
                    value={data.role}
                    onChange={handleChange}
                    placeholder="Enter user role (eg. Student, Parent, etc.)"
                    className="add-adminInput"
                />

                {/* City */}
                <label className="add-adminLabel">City *</label>
                <input
                    id="city"
                    value={data.city}
                    onChange={handleChange}
                    placeholder="Enter user city (eg. New Delhi)"
                    className="add-adminInput"
                />

                {/* Rating */}
                <label className="add-adminLabel ">Rating *</label>
                <StarRating
                    value={data.rating}
                    onChange={(v) => setData((prev) => ({ ...prev, rating: v }))}
                />



                <button
                    type="button"
                    className="add-adminButton"
                    onClick={() => {
                        if (!data.name || !imagePreview || !data.quote || !data.role || !data.city || data.rating < 1) {
                            handleCreate();
                            return;
                        }
                        setShowModal(true);
                    }}
                >
                    Add Testimonial
                </button>
            </div>

            {showModal && (
                <ConfirmModal
                    setShowModal={setShowModal}
                    handleCreate={handleCreate}
                />
            )}
        </div>
    );
};

export default AddTestimonial;