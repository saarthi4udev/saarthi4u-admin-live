import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../college/ConfirmModal";
import { createEducationalPartner } from "../../api/api";

const AddPartner: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const [data, setData] = useState({
        name: "",
        slug: "",
        description: "",
        services: "",
        tag: ""
    });
    const [image, setImage] = useState<File | null>(null);
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
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    // 🔥 slug generator
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replaceAll(/\s+/g, "-")
            .replaceAll(/[^\w-]+/g, "");
    };

    const handleCreate = async () => {
        if (!data.name.trim()) { toast.error("Partner name is required"); return; }
        if (data.name.length > 100) { toast.error("Partner name must be max 100 characters"); return; }
        if (!image) { toast.error("Logo Image is required"); return; }
        if (data.description.length > 200) { toast.error("Description must be max 200 characters"); return; }
        if (data.services.length > 150) { toast.error("Support/Services must be max 150 characters"); return; }
        if (!data.tag) { toast.error("Partner Tag is required"); return; }

        try {
            // ✅ ONLY mapping changed (UI untouched)
            const payload = {
                name: data.name,
                slug: generateSlug(data.name),
                description: data.description,
                services: data.services,      // services → services
                tag: data.tag,               // tag → tag
            };

            const formData = new FormData();
            formData.append("image", image);
            formData.append("name", payload.name);
            formData.append("slug", payload.slug);
            formData.append("description", payload.description);
            formData.append("services", payload.services);
            formData.append("tag", payload.tag);

            console.log("Submitting partner data:", payload);

            await createEducationalPartner(formData);

            toast.success("Partner Added Successfully");

            setShowModal(false);

            setData({
                name: "",
                slug: "",
                description: "",
                services: "",
                tag: ""
            });
            setImage(null);
            setImagePreview(null);

        } catch (err: any) {
            toast.error(err.message || "Failed to add partner");
        }
    };

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">
                Add New Educational Partner
            </p>

            <div className="add-adminForm">

                {/* Partner Name */}
                <label className="add-adminLabel">Partner Name *</label>
                <input
                    className="add-adminInput"
                    id="name"
                    value={data.name}
                    maxLength={100}
                    placeholder="Enter partner name (max 100 chars)"
                    onChange={handleChange}
                />
                <p className="text-xs text-gray-400 -mt-2 mb-2">{data.name.length}/100</p>

                {/* Logo */}
                <label className="add-adminLabel">Image *</label>
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
                            onClick={() => { setImage(null); setImagePreview(null); }}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Description */}
                <label className="add-adminLabel">Description</label>
                <textarea
                    id="description"
                    value={data.description}
                    maxLength={200}
                    rows={3}
                    placeholder='e.g., "Trusted for exam preparation..."'
                    onChange={handleChange}
                    className="add-adminInput"
                ></textarea>

                {/* Support/Services */}
                <label className="add-adminLabel">Support / Services</label>
                <textarea
                    id="services"
                    value={data.services}
                    maxLength={150}
                    rows={2}
                    placeholder='e.g., "JEE/NEET prep"'
                    onChange={handleChange}
                    className="add-adminInput"
                ></textarea>

                {/* Partner Tag */}
                <label className="add-adminLabel">Partner Tag *</label>
                <input
                    className="add-adminInput"
                    id="tag"
                    value={data.tag}
                    maxLength={100}
                    placeholder="Enter partner tag (e.g., 'JEE/NEET')"
                    onChange={handleChange}
                />
                <p className="text-xs text-gray-400 -mt-2 mb-2">{data.tag.length}/100</p>

                {/* Submit */}
                <button
                    className="add-adminButton mt-4"
                    onClick={() => setShowModal(true)}
                >
                    Add Partner
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

export default AddPartner;