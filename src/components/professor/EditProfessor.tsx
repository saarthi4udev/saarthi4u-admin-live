import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfessorById, updateProfessor } from "../../api/api";
const EditProfessor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
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

    // Load professor data
    useEffect(() => {
        const fetchProfessor = async () => {
            try {
                setLoading(true);

                const res = await getProfessorById(id);

                console.log("API RESPONSE:", res); // 👈 MUST CHECK

                const professor =
                    res?.data ||           // correct case (single object)
                    res?.data?.[0];        // fallback (array case)

                if (!professor) {
                    toast.error("No professor found");
                    return;
                }

                setData(professor);
                if (professor.profileImage) {
                    setImagePreview(professor.profileImage);
                }
            } catch (err: any) {
                toast.error(err?.message || "Failed to load professor");
            }
            finally {
                setLoading(false);
            }
        };

        fetchProfessor();
    }, [id]);

    useEffect(() => {
        return () => {
            // Revoke the object URL to free memory when component unmounts or image changes
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Handle normal inputs
    const handleChange = (e: any) => {
        const { id, value, type } = e.target;

        if (type === "number") {
            setData((prev) => ({
                ...prev,
                [id]: Number.parseFloat(value) || 0,
            }));
        } else {
            setData((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImageUrl(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    // Validate and submit
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Validation
        if (!data.name.trim()) {
            toast.error("Name is required");
            return;
        }
        if (data.name.length > 100) {
            toast.error("Name must be max 100 characters");
            return;
        }
        if (!data.title.trim()) {
            toast.error("Title is required");
            return;
        }
        if (data.title.length > 150) {
            toast.error("Title must be max 150 characters");
            return;
        }
        if (!profileImageUrl && !imagePreview) {
            toast.error("Photo is required");
            return;
        }
        if (data.description.length > 500) {
            toast.error("Description must be max 500 characters");
            return;
        }

        try {

            const formData = new FormData();
            if (profileImageUrl) {
                formData.append("profileImage", profileImageUrl);
            }
            formData.append("name", data.name);
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("role", data.role);
            formData.append("experienceYears", data.experienceYears.toString());
            formData.append("qualifications", data.qualifications);
            formData.append("studentsGuided", data.studentsGuided.toString());
            formData.append("rating", data.rating.toString());
            formData.append("totalReviews", data.totalReviews.toString());
            formData.append("shortQualifications", data.shortQualifications);

            // API call will be handled later
            await updateProfessor(id, formData);
            toast.success("Professor Updated Successfully");
            history.push("/professors");
        } catch (err: any) {
            toast.error(err?.message || "Failed to update professor");
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white">
                    Edit Professor
                </h1>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Professor Details
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    {/* Name */}
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            value={data.name}
                            onChange={handleChange}
                            maxLength={100}
                            type="text"
                            placeholder="Enter professor name"
                            className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {data.name.length}/100
                        </p>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            value={data.title}
                            onChange={handleChange}
                            maxLength={150}
                            type="text"
                            placeholder="e.g., Assistant Professor / HOD"
                            className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {data.title.length}/150
                        </p>
                    </div>

                                        {/* Qualifications */}
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Qualifications
                        </label>
                        <input
                            id="qualifications"
                            value={data.qualifications || ""}
                            onChange={handleChange}
                            maxLength={200}
                            type="text"
                            placeholder="Enter professor qualifications"
                            className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {data.qualifications.length}/200
                        </p>
                    </div>

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

                    {/* Description */}
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={handleChange}
                            maxLength={500}
                            rows={3}
                            placeholder="Enter professor description"
                            className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        ></textarea>
                        <p className="mt-1 text-xs text-gray-500">
                            {data.description.length}/500
                        </p>
                    </div>

                    {/* Experience and Students Guided */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Experience in Years
                            </label>
                            <input
                                id="experienceYears"
                                value={data.experienceYears}
                                onChange={handleChange}
                                type="text"
                                placeholder="e.g., 10 Yrs"
                                className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Students Guided
                            </label>
                            <input
                                id="studentsGuided"
                                value={data.studentsGuided}
                                onChange={handleChange}
                                type="text"
                                placeholder="e.g., 1,900+"
                                className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <label className="add-adminLabel">Role</label>
                    <input
                        className="add-adminInput"
                        id="role"
                        value={data.role}
                        placeholder="e.g., Professor"
                        onChange={handleChange}
                    />

                    {/* Rating and Reviews Count */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Rating (0-5)
                            </label>
                            <input
                                id="rating"
                                value={data.rating}
                                onChange={handleChange}
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Reviews Count
                            </label>
                            <input
                                id="totalReviews"
                                value={data.totalReviews}
                                onChange={handleChange}
                                type="number"
                                min="0"
                                className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Qualifications in Short */}
                    <label className="add-adminLabel">Qualifications in Short</label>
                    <input
                        className="add-adminInput"
                        id="shortQualifications"
                        value={data.shortQualifications}
                        placeholder="e.g., Phd, 10+ Yrs Exp"
                        onChange={handleChange}
                    />

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 rounded bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
                        >
                            Update Professor
                        </button>
                        <button
                            type="button"
                            onClick={() => history.push("/professors")}
                            className="flex-1 rounded border border-stroke px-6 py-2 text-center font-medium text-black hover:bg-opacity-10 dark:border-strokedark dark:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfessor;
