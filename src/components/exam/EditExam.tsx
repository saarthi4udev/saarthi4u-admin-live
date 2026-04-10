import { useEffect, useState } from "react";
import { getExamById, updateExam, getAllCategories } from "../../api/api";
import toast from "react-hot-toast";
import ConfirmModal from "../college/ConfirmModal";
import { useParams } from "react-router-dom";
import slugify from "slugify";
import ReactQuill from "react-quill";

export default function EditExam() {
    const { id } = useParams<any>();
    const [data, setData] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    // Fetch Exam + Categories
    useEffect(() => {
        getExamById(id)
            .then((res) => {
                setData(res.data.data);
            })
            .catch(() => toast.error("Failed to load exam"));

        getAllCategories()
            .then((res) => setCategories(res.data.data))
            .catch(() => toast.error("Failed to load categories"));
    }, [id]);

    // Handle normal inputs
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

    // Handle important dates
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

    // Submit
    const handleUpdate = async (e: any) => {
        e.preventDefault();

        if (!data.name || !data.slug || !data.categoryId || !data.level || !data.examMode || !data.examType) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            await updateExam(id, data);

            toast.success("Exam Updated Successfully");

            setTimeout(() => {
                globalThis.location.href = "/exams";
            }, 1000);

        } catch (err: any) {
            toast.error(err?.message || "Exam Update Failed");
        }
    };

    if (!data) return <p>Loading...</p>;

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">
                Edit Exam "{data.name}"
            </p>

            <div className="add-adminForm">

                {/* Name */}
                <label className="add-adminLabel">Exam Name *</label>
                <input
                    className="add-adminInput"
                    id="name"
                    value={data.name || ""}
                    onChange={handleChange}
                />

                {/* Slug */}
                <label className="add-adminLabel">Slug *</label>
                <input
                    className="add-adminInput"
                    value={data.slug || ""}
                    readOnly
                />

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

                {/* Basic Info */}
                <label className="add-adminLabel">Short Name</label>
                <input
                    className="add-adminInput"
                    id="shortName"
                    value={data.shortName || ""}
                    placeholder="Short Name"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Exam Full Name</label>
                <input
                    className="add-adminInput"
                    id="fullName"
                    value={data.fullName || ""}
                    placeholder="Full Name"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Exam Conducting Body</label>
                <input
                    className="add-adminInput"
                    id="conductingBody"
                    value={data.conductingBody || ""}
                    placeholder="Conducting Body"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Official Website</label>
                <input
                    className="add-adminInput"
                    id="officialWebsite"
                    value={data.officialWebsite || ""}
                    placeholder="Official Website"
                    onChange={handleChange}
                />

                {/* Exam Level */}
                <label className="add-adminLabel">Exam Level *</label>
                <select
                    className="add-adminInput"
                    id="level"
                    value={data.level || ""}
                    onChange={handleChange}
                >
                    <option value="">Select exam level</option>
                    <option value="national">National</option>
                    <option value="state">State</option>
                    <option value="university">University</option>
                    <option value="international">International</option>
                </select>

                {/* Exam Mode */}
                <label className="add-adminLabel">Exam Mode *</label>
                <select
                    className="add-adminInput"
                    id="examMode"
                    value={data.examMode || ""}
                    onChange={handleChange}
                >
                    <option value="">Select exam mode</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                </select>

                {/* Exam Type */}
                <label className="add-adminLabel">Exam Type *</label>
                <select
                    className="add-adminInput"
                    id="examType"
                    value={data.examType || ""}
                    onChange={handleChange}
                >
                    <option value="">Select exam type</option>
                    <option value="entrance">Entrance</option>
                    <option value="eligibility">Eligibility</option>
                    <option value="scholarship">Scholarship</option>
                </select>

                <label className="add-adminLabel">Exam Frequency</label>
                <input
                    className="add-adminInput"
                    id="frequency"
                    value={data.frequency || ""}
                    placeholder="Yearly / Twice a year"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Exam Duration</label>
                <input
                    className="add-adminInput"
                    id="duration"
                    value={data.duration || ""}
                    placeholder="3 hours"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Total Marks</label>
                <input
                    className="add-adminInput"
                    id="totalMarks"
                    type="number"
                    value={data.totalMarks || ""}
                    placeholder="360"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Application Fee</label>
                <input
                    className="add-adminInput"
                    id="applicationFee"
                    value={data.applicationFee || ""}
                    placeholder="₹2800"
                    onChange={handleChange}
                />

                {/* Overview */}
                <label className="add-adminLabel">Overview</label>
                <ReactQuill
                    theme="snow"
                    value={data.overview || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({
                            ...prev,
                            overview: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* Eligibility */}
                <label className="add-adminLabel">Eligibility</label>
                <ReactQuill
                    theme="snow"
                    value={data.eligibility || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({
                            ...prev,
                            eligibility: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* Exam Pattern */}
                <label className="add-adminLabel">Exam Pattern</label>
                <ReactQuill
                    theme="snow"
                    value={data.examPattern || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({
                            ...prev,
                            examPattern: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* Syllabus */}
                <label className="add-adminLabel">Syllabus</label>
                <ReactQuill
                    theme="snow"
                    value={data.syllabus || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({
                            ...prev,
                            syllabus: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* Important Dates */}
                <p className="font-semibold mt-4">Important Dates</p>

                <label className="add-adminLabel">Application Start Date</label>
                <input
                    type="date"
                    id="applicationStart"
                    className="add-adminInput"
                    value={data.importantDates?.applicationStart || ""}
                    onChange={handleDateChange}
                />

                <label className="add-adminLabel">Application End Date</label>
                <input
                    type="date"
                    id="applicationEnd"
                    className="add-adminInput"
                    value={data.importantDates?.applicationEnd || ""}
                    onChange={handleDateChange}
                />

                <label className="add-adminLabel">Exam Date</label>
                <input
                    type="date"
                    id="examDate"
                    className="add-adminInput"
                    value={data.importantDates?.examDate || ""}
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

                <label className="add-adminLabel">Application Process</label>
                <ReactQuill
                    theme="snow"
                    value={data.applicationProcess || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({
                            ...prev,
                            applicationProcess: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Admit Card Details</label>
                <ReactQuill
                    theme="snow"
                    value={data.admitCardDetails || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({
                            ...prev,
                            admitCardDetails: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Result Details</label>
                <ReactQuill
                    theme="snow"
                    value={data.resultDetails || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({
                            ...prev,
                            resultDetails: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Cutoff Details</label>
                <ReactQuill
                    theme="snow"
                    value={data.cutoffDetails || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({
                            ...prev,
                            cutoffDetails: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Counselling Details</label>
                <ReactQuill
                    theme="snow"
                    value={data.counsellingDetails || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({
                            ...prev,
                            counsellingDetails: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* SEO */}
                <label className="add-adminLabel">SEO title</label>
                <input
                    className="add-adminInput"
                    id="metaTitle"
                    value={data.metaTitle || ""}
                    placeholder="SEO Title"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">SEO Keywords</label>
                <input
                    className="add-adminInput"
                    id="metaKeywords"
                    value={data.metaKeywords || ""}
                    placeholder="SEO Keywords"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Meta Description</label>
                <ReactQuill
                    theme="snow"
                    value={data.metaDescription || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({
                            ...prev,
                            metaDescription: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* Visibility */}
                <div className="flex items-center gap-2 mt-3">
                    <input
                        type="checkbox"
                        id="visible"
                        checked={data.visible}
                        onChange={handleChange}
                    />
                    <label>Visible on website</label>
                </div>

                {/* Submit */}
                <button
                    className="add-adminButton mt-4"
                    onClick={() => setShowModal(true)}
                >
                    Update Exam
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