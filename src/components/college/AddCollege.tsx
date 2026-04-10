import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createCollege, getAllCategories } from "../../api/api";
import slugify from "slugify";
import ReactQuill from "react-quill";

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
    "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const AddCollege: React.FC<{ onCreated?: (college: any) => void }> = ({ onCreated }) => {
    const [data, setData] = useState({
        name: "",
        slug: "",
        categoryId: "",
        type: "",
        establishedYear: "",
        affiliation: "",
        city: "",
        state: "",
        country: "India",
        overview: "",
        visible: true,
        metaDescription: "",
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);           
    const [bannerFile, setBannerFile] = useState<File | null>(null);       
    const [logoPreview, setLogoPreview] = useState<string | null>(null);   
    const [bannerPreview, setBannerPreview] = useState<string | null>(null); 

    const [isForeignState, setIsForeignState] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getAllCategories()
            .then((res) => setCategories(res.data.data))
            .catch(() => toast.error("Failed to load categories"));
    }, []);

    useEffect(() => {
        if (data.country !== "India") setIsForeignState(true);
    }, [data.country]);

    // ✅ Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            if (bannerPreview) URL.revokeObjectURL(bannerPreview);
        };
    }, [logoPreview, bannerPreview]);

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setData((prev) => ({
            ...prev,
            [id]: value,
            ...(id === "name" && { slug: slugify(value, { lower: true, strict: true }) }),
        }));
    };

    // ✅ Handle logo file change
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    // ✅ Handle banner file change
    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!data.name || !data.slug || !logoFile || !data.categoryId || !data.type) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            // ✅ Build FormData
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("slug", data.slug);
            formData.append("categoryId", data.categoryId);
            formData.append("type", data.type);
            formData.append("establishedYear", data.establishedYear);
            formData.append("affiliation", data.affiliation);
            formData.append("city", data.city);
            formData.append("state", data.state);
            formData.append("country", data.country);
            formData.append("overview", data.overview);
            formData.append("visible", String(data.visible));
            formData.append("metaDescription", data.metaDescription);

            if (logoFile) formData.append("logo", logoFile);
            if (bannerFile) formData.append("bannerImg", bannerFile);

            const res = await createCollege(formData);

            if (res.status === 200) {
                toast.success("College Created Successfully", { position: "top-right" });
                if (onCreated) onCreated(res.data.data);
            } else {
                toast.error("College Creation Failed");
            }
        } catch (err: any) {
            toast.error(err?.message || "College Creation Failed");
        }

        setShowModal(false);
    };

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">Add New College</p>

            <div className="add-adminForm">

                {/* Name */}
                <label className="add-adminLabel">Name *</label>
                <input
                    className="add-adminInput"
                    id="name"
                    placeholder="Enter College Name Eg. IIT Bombay"
                    onChange={handleChange}
                    required
                />

                {/* Logo Upload */}
                <label className="add-adminLabel">College Logo *</label>
                <input
                    type="file"
                    className="add-adminInput"
                    accept="image/*"
                    onChange={handleLogoChange}
                />
                {/* ✅ Logo Preview */}
                {logoPreview && (
                    <div className="mt-2 mb-4 relative w-fit">
                        <img
                            src={logoPreview}
                            alt="Logo Preview"
                            className="h-24 w-24 rounded-md object-contain border border-gray-300 bg-gray-50"
                        />
                        <button
                            type="button"
                            onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Banner Image Upload */}
                <label className="add-adminLabel">Banner Image</label>
                <input
                    type="file"
                    className="add-adminInput"
                    accept="image/*"
                    onChange={handleBannerChange}
                />
                {/* ✅ Banner Preview */}
                {bannerPreview && (
                    <div className="mt-2 mb-4 relative w-fit">
                        <img
                            src={bannerPreview}
                            alt="Banner Preview"
                            className="h-40 w-full max-w-lg rounded-md object-cover border border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={() => { setBannerFile(null); setBannerPreview(null); }}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Slug */}
                <label className="add-adminLabel">Slug *</label>
                <input
                    className="add-adminInput"
                    id="slug"
                    placeholder="Auto-Generated from Name"
                    value={data.slug}
                    readOnly
                />

                {/* Category */}
                <label className="add-adminLabel">Category *</label>
                <select className="add-adminInput" id="categoryId" onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                {/* Type */}
                <label className="add-adminLabel">Type *</label>
                <select className="add-adminInput" id="type" onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="college">College</option>
                    <option value="university">University</option>
                </select>

                {/* Established Year */}
                <label className="add-adminLabel">Established Year</label>
                <input
                    className="add-adminInput"
                    id="establishedYear"
                    type="number"
                    placeholder="Eg. 1999"
                    onChange={handleChange}
                />

                {/* Affiliation */}
                <label className="add-adminLabel">Affiliation</label>
                <input
                    className="add-adminInput"
                    id="affiliation"
                    placeholder="Eg. Affiliated with Mumbai University"
                    onChange={handleChange}
                />

                {/* Country */}
                <label className="add-adminLabel">Country</label>
                <input
                    className="add-adminInput"
                    id="country"
                    placeholder="Eg. India, USA"
                    value={data.country}
                    onChange={handleChange}
                />

                {/* State */}
                <label className="add-adminLabel">State</label>
                <select
                    className="add-adminInput"
                    value={isForeignState ? "OTHER" : data.state}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "OTHER") {
                            setIsForeignState(true);
                            setData({ ...data, state: "" });
                        } else {
                            setIsForeignState(false);
                            setData({ ...data, state: value });
                        }
                    }}
                >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                    <option value="OTHER">Other (Foreign)</option>
                </select>

                {isForeignState && (
                    <input
                        className="add-adminInput mt-2"
                        placeholder="Enter foreign state / province"
                        value={data.state}
                        onChange={(e) => setData({ ...data, state: e.target.value })}
                    />
                )}

                {/* City */}
                <label className="add-adminLabel">City</label>
                <input
                    className="add-adminInput"
                    id="city"
                    placeholder="Eg. Mumbai, Delhi"
                    onChange={handleChange}
                />

                {/* Overview */}
                <label className="add-adminLabel">Overview</label>
                <ReactQuill
                    theme="snow"
                    value={data.overview}
                    placeholder="Eg. IIT Bombay is best for BTech..."
                    onChange={(value) => setData((prev) => ({ ...prev, overview: value }))}
                    className="bg-white mb-4 text-black"
                />

                {/* Meta Description */}
                <label className="add-adminLabel">Meta Description</label>
                <ReactQuill
                    theme="snow"
                    value={data.metaDescription}
                    placeholder="Enter Meta Description"
                    onChange={(value) => setData((prev) => ({ ...prev, metaDescription: value }))}
                    className="bg-white mb-4 text-black"
                />

                {/* Visible */}
                <div className="flex items-center gap-2 mt-3">
                    <input
                        type="checkbox"
                        checked={data.visible}
                        onChange={(e) => setData({ ...data, visible: e.target.checked })}
                    />
                    <label>Visible</label>
                </div>

                {/* Submit */}
                <button className="add-adminButton mt-4" onClick={() => setShowModal(true)}>
                    Add College
                </button>

                {showModal && (
                    <>
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded shadow-lg w-96">
                                <h3 className="text-xl font-semibold mb-4">Confirmation</h3>
                                <p>Are you sure you want to add this college?</p>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button className="text-red-500 font-bold" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button className="bg-emerald-500 px-4 py-2 rounded" onClick={handleSubmit}>
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 bg-black"></div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AddCollege;