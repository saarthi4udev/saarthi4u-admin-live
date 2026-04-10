import React, { useEffect, useState } from "react";
import { createScholarship, getAllCategories } from "../../api/api";
import toast from "react-hot-toast";
import slugify from "slugify";
import ConfirmModal from "../college/ConfirmModal";
import ReactQuill from "react-quill";

const AddScholarship: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [data, setData] = useState({
        name: "",
        slug: "",
        shortName: "",
        categoryId: "",
        provider: "",
        scholarshipType: "",
        level: "",
        amount: "",
        applicationMode: "",
        officialWebsite: "",
        overview: "",
        eligibility: "",
        benefits: "",
        applicationProcess: "",
        documentsRequired: "",
        selectionProcess: "",
        renewalProcess: "",
        metaTitle: "",
        metaKeywords: "",
        metaDescription: "",
        visible: true,
        importantDates: {
            applicationStart: "",
            applicationEnd: "",
            resultDate: "",
        },
    });

    // Load categories
    useEffect(() => {
        getAllCategories()
            .then((res) => setCategories(res.data.data))
            .catch(() => toast.error("Failed to load categories"));
    }, []);

    // Handle normal fields
    const handleChange = (e: any) => {
        const { id, value } = e.target;

        setData((prev) => ({
            ...prev,
            [id]: value,
            ...(id === "name" && {
                slug: slugify(value, { lower: true, strict: true }),
            }),
        }));
    };

    // Handle important dates
    const handleDateChange = (e: any) => {
        const { id, value } = e.target;

        setData((prev) => ({
            ...prev,
            importantDates: {
                ...prev.importantDates,
                [id]: value,
            },
        }));
    };

    // Submit
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!data.name || !data.slug || !data.categoryId) {
            toast.error("Please fill required fields");
            return;
        }

        try {
            const res = await createScholarship(data);

            if (res.status === 200) {
                toast.success("Scholarship Created Successfully");
                setShowModal(false);
            } else {
                toast.error("Scholarship Creation Failed");
            }
        } catch (err: any) {
            toast.error(err?.message || "Scholarship Creation Failed");
        }
    };

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">
                Add New Scholarship
            </p>

            <div className="add-adminForm">

                {/* Name */}
                <label className="add-adminLabel">Scholarship Name *</label>
                <input
                    className="add-adminInput"
                    id="name"
                    placeholder="Enter scholarship name"
                    onChange={handleChange}
                />

                {/* Slug */}
                <label className="add-adminLabel">Slug *</label>
                <input
                    className="add-adminInput"
                    value={data.slug}
                    readOnly
                />

                {/* Category */}
                <label className="add-adminLabel">Category *</label>
                <select
                    className="add-adminInput"
                    id="categoryId"
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Basic Info */}
                <label className="add-adminLabel">Short Name</label>
                <input className="add-adminInput" id="shortName" onChange={handleChange} />

                <label className="add-adminLabel">Provider</label>
                <input className="add-adminInput" id="provider" onChange={handleChange} />

                <label className="add-adminLabel">Scholarship Type</label>
                <input className="add-adminInput" id="scholarshipType" placeholder="government / private" onChange={handleChange} />

                <label className="add-adminLabel">Level</label>
                <input className="add-adminInput" id="level" placeholder="ug / pg / phd" onChange={handleChange} />

                <label className="add-adminLabel">Amount</label>
                <input className="add-adminInput" id="amount" placeholder="₹50,000 per year" onChange={handleChange} />

                <label className="add-adminLabel">Application Mode</label>
                <input className="add-adminInput" id="applicationMode" placeholder="online / offline" onChange={handleChange} />

                <label className="add-adminLabel">Official Website</label>
                <input className="add-adminInput" id="officialWebsite" onChange={handleChange} />

                {/* Rich Sections */}
                <label className="add-adminLabel">Overview</label>
                <ReactQuill
                    theme="snow"
                    value={data.overview}
                    onChange={(value) => setData({ ...data, overview: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Eligibility</label>
                <ReactQuill
                    theme="snow"
                    value={data.eligibility}
                    onChange={(value) => setData({ ...data, eligibility: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Benefits</label>
                <ReactQuill
                    theme="snow"
                    value={data.benefits}
                    onChange={(value) => setData({ ...data, benefits: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Application Process</label>
                <ReactQuill
                    theme="snow"
                    value={data.applicationProcess}
                    onChange={(value) => setData({ ...data, applicationProcess: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Documents Required</label>
                <ReactQuill
                    theme="snow"
                    value={data.documentsRequired}
                    onChange={(value) => setData({ ...data, documentsRequired: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Selection Process</label>
                <ReactQuill
                    theme="snow"
                    value={data.selectionProcess}
                    onChange={(value) => setData({ ...data, selectionProcess: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Renewal Process</label>
                <ReactQuill
                    theme="snow"
                    value={data.renewalProcess}
                    onChange={(value) => setData({ ...data, renewalProcess: value })}
                    className="bg-white mb-4 text-black"
                />

                {/* Important Dates */}
                <p className="font-semibold mt-4">Important Dates</p>

                <label className="add-adminLabel">Application Start Date</label>
                <input type="date" id="applicationStart" className="add-adminInput" onChange={handleDateChange} />

                <label className="add-adminLabel">Application End Date</label>
                <input type="date" id="applicationEnd" className="add-adminInput" onChange={handleDateChange} />

                <label className="add-adminLabel">Result Date</label>
                <input type="date" id="resultDate" className="add-adminInput" onChange={handleDateChange} />

                {/* SEO */}
                <label className="add-adminLabel">SEO Title</label>
                <input className="add-adminInput" id="metaTitle" onChange={handleChange} />

                <label className="add-adminLabel">SEO Keywords</label>
                <input className="add-adminInput" id="metaKeywords" onChange={handleChange} />

                <label className="add-adminLabel">Meta Description</label>
                <ReactQuill
                    theme="snow"
                    value={data.metaDescription}
                    onChange={(value) => setData({ ...data, metaDescription: value })}
                    className="bg-white mb-4 text-black"
                />

                {/* Visible */}
                <div className="flex items-center gap-2 mt-3">
                    <input
                        type="checkbox"
                        checked={data.visible}
                        onChange={(e) =>
                            setData({ ...data, visible: e.target.checked })
                        }
                    />
                    <label>Visible on website</label>
                </div>

                {/* Submit */}
                <button
                    className="add-adminButton mt-4"
                    onClick={() => setShowModal(true)}
                >
                    Create Scholarship
                </button>

                {showModal && (
                    <ConfirmModal
                        setShowModal={setShowModal}
                        handleCreate={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
};

export default AddScholarship;