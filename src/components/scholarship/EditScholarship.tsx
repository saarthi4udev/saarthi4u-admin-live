import { useEffect, useState } from "react";
import {
    getScholarshipById,
    updateScholarship,
    getAllCategories,
} from "../../api/api";
import toast from "react-hot-toast";
import ConfirmModal from "../college/ConfirmModal";
import { useParams } from "react-router-dom";
import slugify from "slugify";
import ReactQuill from "react-quill";

export default function EditScholarship() {
    const { id } = useParams<any>();
    const [data, setData] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getScholarshipById(id)
            .then((res) => setData(res.data.data))
            .catch(() => toast.error("Failed to load scholarship"));

        getAllCategories()
            .then((res) => setCategories(res.data.data))
            .catch(() => toast.error("Failed to load categories"));
    }, [id]);

    // Normal input handler
    const handleChange = (e: any) => {
        const { id, value, type, checked } = e.target;

        setData((prev: any) => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
            ...(id === "name" && {
                slug: slugify(value, { lower: true, strict: true }),
            }),
        }));
    };

    // Important Dates handler
    const handleDateChange = (e: any) => {
        const { id, value } = e.target;

        setData((prev: any) => ({
            ...prev,
            importantDates: {
                ...prev.importantDates,
                [id]: value,
            },
        }));
    };

    const handleUpdate = async (e: any) => {
        e.preventDefault();

        if (!data.name || !data.slug || !data.categoryId) {
            toast.error("Please fill required fields");
            return;
        }

        try {
            await updateScholarship(id, data);
            toast.success("Scholarship Updated Successfully");

            setTimeout(() => {
                globalThis.location.href = "/scholarships";
            }, 1000);
        } catch (err: any) {
            toast.error(err?.message || "Scholarship Update Failed");
        }
    };

    if (!data) return <p>Loading...</p>;

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">
                Edit Scholarship "{data.name}"
            </p>

            <div className="add-adminForm">
                {/* Name */}
                <label className="add-adminLabel">Scholarship Name *</label>
                <input
                    className="add-adminInput"
                    id="name"
                    value={data.name || ""}
                    onChange={handleChange}
                />

                {/* Slug */}
                <label className="add-adminLabel">Slug *</label>
                <input className="add-adminInput" value={data.slug || ""} readOnly />

                {/* Category */}
                <label className="add-adminLabel">Category *</label>
                <select
                    className="add-adminInput"
                    id="categoryId"
                    value={data.categoryId || ""}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Basic Fields */}
                <label className="add-adminLabel">Short Name</label>
                <input
                    className="add-adminInput"
                    id="shortName"
                    value={data.shortName || ""}
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Provider</label>
                <input
                    className="add-adminInput"
                    id="provider"
                    value={data.provider || ""}
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Scholarship Type</label>
                <input
                    className="add-adminInput"
                    id="scholarshipType"
                    value={data.scholarshipType || ""}
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Level</label>
                <input
                    className="add-adminInput"
                    id="level"
                    value={data.level || ""}
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Amount</label>
                <input
                    className="add-adminInput"
                    id="amount"
                    value={data.amount || ""}
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Application Mode</label>
                <input
                    className="add-adminInput"
                    id="applicationMode"
                    value={data.applicationMode || ""}
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Official Website</label>
                <input
                    className="add-adminInput"
                    id="officialWebsite"
                    value={data.officialWebsite || ""}
                    onChange={handleChange}
                />

                {/* Rich Text Sections */}
                <label className="add-adminLabel">Overview</label>
                <ReactQuill
                    theme="snow"
                    value={data.overview || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({ ...prev, overview: value }))
                    }
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Eligibility</label>
                <ReactQuill
                    theme="snow"
                    value={data.eligibility || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({ ...prev, eligibility: value }))
                    }
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Benefits</label>
                <ReactQuill
                    theme="snow"
                    value={data.benefits || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({ ...prev, benefits: value }))
                    }
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Application Process</label>
                <ReactQuill
                    theme="snow"
                    value={data.applicationProcess || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({ ...prev, applicationProcess: value }))
                    }
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Documents Required</label>
                <ReactQuill
                    theme="snow"
                    value={data.documentsRequired || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({ ...prev, documentsRequired: value }))
                    }
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Selection Process</label>
                <ReactQuill
                    theme="snow"
                    value={data.selectionProcess || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({ ...prev, selectionProcess: value }))
                    }
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Renewal Process</label>
                <ReactQuill
                    theme="snow"
                    value={data.renewalProcess || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({ ...prev, renewalProcess: value }))
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* Important Dates */}
                <p className="font-semibold mt-4">Important Dates</p>

                <label className="add-adminLabel">Application Start</label>
                <input
                    type="date"
                    id="applicationStart"
                    className="add-adminInput"
                    value={data.importantDates?.applicationStart || ""}
                    onChange={handleDateChange}
                />

                <label className="add-adminLabel">Application End</label>
                <input
                    type="date"
                    id="applicationEnd"
                    className="add-adminInput"
                    value={data.importantDates?.applicationEnd || ""}
                    onChange={handleDateChange}
                />

                <label className="add-adminLabel">Result Date</label>
                <input
                    type="date"
                    id="resultDate"
                    className="add-adminInput"
                    value={data.importantDates?.resultDate || ""}
                    onChange={handleDateChange}
                />

                {/* SEO */}
                <label className="add-adminLabel">Meta Title</label>
                <input
                    className="add-adminInput"
                    id="metaTitle"
                    value={data.metaTitle || ""}
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Meta Keywords</label>
                <input
                    className="add-adminInput"
                    id="metaKeywords"
                    value={data.metaKeywords || ""}
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Meta Description</label>
                <ReactQuill
                    theme="snow"
                    value={data.metaDescription || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({ ...prev, metaDescription: value }))
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* Visible */}
                <div className="flex items-center gap-2 mt-3">
                    <input
                        type="checkbox"
                        id="visible"
                        checked={data.visible}
                        onChange={handleChange}
                    />
                    <label>Visible on website</label>
                </div>

                <button
                    className="add-adminButton mt-4"
                    onClick={() => setShowModal(true)}
                >
                    Update Scholarship
                </button>

                {showModal && (
                    <ConfirmModal
                        setShowModal={setShowModal}
                        handleCreate={handleUpdate}
                    />
                )}
            </div>
        </div>
    );
}