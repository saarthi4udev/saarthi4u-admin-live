import React, { useEffect, useState } from "react";
import { createExam, getAllCategories } from "../../api/api";
import toast from "react-hot-toast";
import slugify from "slugify";
import ConfirmModal from "../college/ConfirmModal";
import ReactQuill from "react-quill";

const AddExam: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [data, setData] = useState({
        name: "",
        slug: "",
        shortName: "",
        fullName: "",
        categoryId: "",
        level: "",
        examMode: "",
        examType: "",
        conductingBody: "",
        frequency: "",
        duration: "",
        totalMarks: "",
        applicationFee: "",
        officialWebsite: "",
        overview: "",
        eligibility: "",
        examPattern: "",
        syllabus: "",
        applicationProcess: "",
        admitCardDetails: "",
        resultDetails: "",
        cutoffDetails: "",
        counsellingDetails: "",
        metaTitle: "",
        metaKeywords: "",
        metaDescription: "",
        visible: true,
        importantDates: {
            applicationStart: "",
            applicationEnd: "",
            examDate: "",
            resultDate: "",
        },
    });

    // Fetch categories
    useEffect(() => {
        getAllCategories()
            .then((res) => setCategories(res.data.data))
            .catch(() => toast.error("Failed to load categories"));
    }, []);

    // Handle normal inputs
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
            const res = await createExam(data);

            if (res.status === 200) {
                toast.success("Exam Created Successfully");
                setShowModal(false);
            } else {
                toast.error("Exam Creation Failed");
            }
        } catch (err: any) {
            toast.error(err?.message || "Exam Creation Failed");
        }
    };

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">
                Add New Exam
            </p>

            <div className="add-adminForm">

                {/* Name */}
                <label className="add-adminLabel">Exam Name *</label>
                <input
                    className="add-adminInput"
                    id="name"
                    placeholder="Enter exam name (e.g. JEE Mains)"
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
                <input className="add-adminInput" id="shortName" placeholder="Short Name (e.g. JEE)" onChange={handleChange} />
                <label className="add-adminLabel">Exam Full Name</label>
                <input className="add-adminInput" id="fullName" placeholder="Full Name (Joint Entrance Examination Main)" onChange={handleChange} />
                <label className="add-adminLabel">Exam Conducting Body</label>
                <input className="add-adminInput" id="conductingBody" placeholder="Conducting Body (e.g. NTA)" onChange={handleChange} />
                <label className="add-adminLabel">Official Website URL</label>
                <input className="add-adminInput" id="officialWebsite" placeholder="Official Website URL" onChange={handleChange} />

                <label className="add-adminLabel">Exam Level *</label>
                <select
                    className="add-adminInput"
                    id="level"
                    value={data.level}
                    onChange={handleChange}
                >
                    <option value="">Select exam level</option>
                    <option value="national">National</option>
                    <option value="state">State</option>
                    <option value="university">University</option>
                    <option value="international">International</option>
                </select>

                <label className="add-adminLabel">Exam Mode *</label>
                <select
                    className="add-adminInput"
                    id="examMode"
                    value={data.examMode}
                    onChange={handleChange}
                >
                    <option value="">Select exam mode</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                </select>

                <label className="add-adminLabel">Exam Type *</label>
                <select
                    className="add-adminInput"
                    id="examType"
                    value={data.examType}
                    onChange={handleChange}
                >
                    <option value="">Select exam type</option>
                    <option value="entrance">Entrance Exam</option>
                    <option value="eligibility">Eligibility Test</option>
                    <option value="scholarship">Scholarship Exam</option>
                </select>

                <label className="add-adminLabel">Exam Frequency</label>
                <input
                    className="add-adminInput"
                    id="frequency"
                    placeholder="e.g. Once a year"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Duration</label>
                <input
                    className="add-adminInput"
                    id="duration"
                    placeholder="e.g. 3 Hours"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Total Marks</label>
                <input
                    className="add-adminInput"
                    type="number"
                    id="totalMarks"
                    placeholder="e.g. 300"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Application Fee</label>
                <input
                    className="add-adminInput"
                    id="applicationFee"
                    placeholder="e.g. 1000 INR"
                    onChange={handleChange}
                />
                {/* Rich Text Sections */}
                <label className="add-adminLabel">Overview</label>
                <ReactQuill theme="snow" value={data.overview}
                    placeholder="Write complete exam overview..."
                    onChange={(value) => setData({ ...data, overview: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Eligibility</label>
                <ReactQuill theme="snow" value={data.eligibility}
                    placeholder="Eligibility criteria..."
                    onChange={(value) => setData({ ...data, eligibility: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Exam Pattern</label>
                <ReactQuill theme="snow" value={data.examPattern}
                    placeholder="Exam pattern details..."
                    onChange={(value) => setData({ ...data, examPattern: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Syllabus</label>
                <ReactQuill theme="snow" value={data.syllabus}
                    placeholder="Syllabus details..."
                    onChange={(value) => setData({ ...data, syllabus: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Application Process</label>
                <ReactQuill
                    theme="snow"
                    value={data.applicationProcess}
                    placeholder="Explain how to apply for the exam..."
                    onChange={(value) => setData({ ...data, applicationProcess: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Admit Card Details</label>
                <ReactQuill
                    theme="snow"
                    value={data.admitCardDetails}
                    placeholder="Admit card release details..."
                    onChange={(value) => setData({ ...data, admitCardDetails: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Result Details</label>
                <ReactQuill
                    theme="snow"
                    value={data.resultDetails}
                    placeholder="Explain result process..."
                    onChange={(value) => setData({ ...data, resultDetails: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Cutoff Details</label>
                <ReactQuill
                    theme="snow"
                    value={data.cutoffDetails}
                    placeholder="Cutoff explanation..."
                    onChange={(value) => setData({ ...data, cutoffDetails: value })}
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Counselling Details</label>
                <ReactQuill
                    theme="snow"
                    value={data.counsellingDetails}
                    placeholder="Counselling procedure..."
                    onChange={(value) => setData({ ...data, counsellingDetails: value })}
                    className="bg-white mb-4 text-black"
                />

                {/* Important Dates */}
                <p className="font-semibold mt-4">Important Dates</p>
                <label className="add-adminLabel">Application Start Date</label>
                <input type="date" id="applicationStart" className="add-adminInput" onChange={handleDateChange} />
                <label className="add-adminLabel">Application End Date</label>
                <input type="date" id="applicationEnd" className="add-adminInput" onChange={handleDateChange} />
                <label className="add-adminLabel">Exam Date</label>
                <input type="date" id="examDate" className="add-adminInput" onChange={handleDateChange} />
                <label className="add-adminLabel">Result Date</label>
                <input type="date" id="resultDate" className="add-adminInput" onChange={handleDateChange} />

                {/* SEO */}
                <label className="add-adminLabel">SEO Title</label>
                <input className="add-adminInput" id="metaTitle" placeholder="SEO Title" onChange={handleChange} />
                <label className="add-adminLabel">SEO Keywords</label>
                <input className="add-adminInput" id="metaKeywords" placeholder="SEO Keywords (comma separated)" onChange={handleChange} />

                <label className="add-adminLabel">Meta Description</label>
                <ReactQuill
                    theme="snow"
                    value={data.metaDescription}
                    placeholder="SEO description for Google search result..."
                    onChange={(value) => setData({ ...data, metaDescription: value })}
                    className="bg-white mb-4 text-black"
                />

                {/* Visibility */}
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
                    Create Exam
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

export default AddExam;