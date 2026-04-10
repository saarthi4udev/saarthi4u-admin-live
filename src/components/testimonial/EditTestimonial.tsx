import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../college/ConfirmModal";

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
                <span className="ml-2 self-center text-sm text-gray-500">{value} / 5</span>
            )}
        </div>
    );
};

const EditTestimonial: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string>("");

    const [data, setData] = useState({
        name: "",
        avatar: "",
        quote: "",
        role: "",
        city: "",
        rating: 0,
        testimonialType: "",
        status: "Active",
        displayOrder: "",
    });

    useEffect(() => {
        // API call will be implemented later
        // getTestimonial(id).then(res => {
        //     setData(res.data.data);
        //     setAvatarPreview(res.data.data.avatar);
        // }).catch(() => toast.error("Failed to load testimonial"));
    }, [id]);

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setData((prev) => ({ ...prev, [id]: value }));
    };

    const handleAvatarUpload = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setAvatarPreview(result);
                setData((prev) => ({ ...prev, avatar: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUrl = (e: any) => {
        const url = e.target.value;
        setData((prev) => ({ ...prev, avatar: url }));
        setAvatarPreview(url);
    };

    const handleCreate = async () => {
        if (!data.name.trim()) { toast.error("Name is required"); return; }
        if (data.name.length > 100) { toast.error("Name must be max 100 characters"); return; }
        if (!data.avatar) { toast.error("Avatar photo is required"); return; }
        if (!data.quote.trim()) { toast.error("Quote/Experience is required"); return; }
        if (data.quote.length > 600) { toast.error("Quote must be max 600 characters"); return; }
        if (!data.role.trim()) { toast.error("Role/Profession is required"); return; }
        if (!data.city.trim()) { toast.error("City is required"); return; }
        if (data.city.length > 50) { toast.error("City must be max 50 characters"); return; }
        if (data.rating < 1 || data.rating > 5) { toast.error("Please select a rating (1–5 stars)"); return; }
        if (!data.testimonialType) { toast.error("Testimonial type is required"); return; }

        try {
            // await updateTestimonial(id, data);
            console.log("Updating testimonial:", id, data);
            toast.success("Testimonial Updated Successfully");
            setShowModal(false);
            history.push("/testimonials");
        } catch (err: any) {
            toast.error(err?.message || "Failed to update testimonial");
        }
    };

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">
                Edit Testimonial
            </p>

            <div className="add-adminForm">

                {/* Name */}
                <label className="add-adminLabel">Name *</label>
                <input
                    className="add-adminInput"
                    id="name"
                    value={data.name}
                    maxLength={100}
                    placeholder="Enter full name (max 100 chars)"
                    onChange={handleChange}
                />
                <p className="text-xs text-gray-400 -mt-2 mb-2">{data.name.length}/100</p>

                {/* Avatar Photo */}
                <label className="add-adminLabel">Avatar Photo *</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <input
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleAvatarUpload}
                            className="add-adminInput"
                        />
                        <p className="text-xs text-gray-400 mt-1">Upload JPG / PNG</p>
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Or paste image URL"
                            onChange={handleAvatarUrl}
                            className="add-adminInput"
                        />
                    </div>
                </div>
                {avatarPreview && (
                    <div className="mb-4">
                        <img
                            src={avatarPreview}
                            alt="Avatar Preview"
                            className="h-20 w-20 rounded-full object-cover border border-stroke"
                        />
                    </div>
                )}

                {/* Quote */}
                <label className="add-adminLabel">Quote / Experience *</label>
                <textarea
                    id="quote"
                    value={data.quote}
                    maxLength={600}
                    rows={5}
                    placeholder="Enter testimonial quote or experience (max 600 chars)"
                    onChange={handleChange}
                    className="add-adminInput"
                ></textarea>
                <p className="text-xs text-gray-400 -mt-2 mb-2">{data.quote.length}/600</p>

                {/* Role / Profession */}
                <label className="add-adminLabel">Role / Profession *</label>
                <input
                    className="add-adminInput"
                    id="role"
                    value={data.role}
                    placeholder="e.g., Software Engineer, MBBS Aspirant, Parent"
                    onChange={handleChange}
                />

                {/* City */}
                <label className="add-adminLabel">City *</label>
                <input
                    className="add-adminInput"
                    id="city"
                    value={data.city}
                    maxLength={50}
                    placeholder="e.g., Mumbai (max 50 chars)"
                    onChange={handleChange}
                />
                <p className="text-xs text-gray-400 -mt-2 mb-2">{data.city.length}/50</p>

                {/* Rating */}
                <label className="add-adminLabel">Rating * (1–5 stars)</label>
                <StarRating
                    value={data.rating}
                    onChange={(v) => setData((prev) => ({ ...prev, rating: v }))}
                />

                {/* Testimonial Type */}
                <label className="add-adminLabel">Testimonial Type *</label>
                <select
                    id="testimonialType"
                    value={data.testimonialType}
                    onChange={handleChange}
                    className="add-adminInput"
                >
                    <option value="">Select Type</option>
                    <option value="Student">Student</option>
                    <option value="Parent">Parent</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Counselor">Counselor</option>
                    <option value="Other">Other</option>
                </select>

                {/* Status */}
                <label className="add-adminLabel">Status</label>
                <select
                    id="status"
                    value={data.status}
                    onChange={handleChange}
                    className="add-adminInput"
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                </select>

                {/* Display Order */}
                <label className="add-adminLabel">Display Order</label>
                <input
                    className="add-adminInput"
                    id="displayOrder"
                    type="number"
                    min="0"
                    value={data.displayOrder}
                    placeholder="Sorting order (lower = shown first)"
                    onChange={handleChange}
                />

                <div className="flex gap-3">
                    <button
                        type="button"
                        className="add-adminButton"
                        onClick={() => {
                            if (!data.name.trim() || !data.avatar || !data.quote.trim() ||
                                !data.role.trim() || !data.city.trim() || data.rating < 1 ||
                                !data.testimonialType) {
                                handleCreate();
                                return;
                            }
                            setShowModal(true);
                        }}
                    >
                        Update Testimonial
                    </button>
                    <button
                        type="button"
                        onClick={() => history.push("/testimonials")}
                        className="rounded border border-stroke px-6 py-2.5 text-sm font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                    >
                        Cancel
                    </button>
                </div>
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

export default EditTestimonial;
