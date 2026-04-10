import { useEffect, useState } from "react";
import { getInternationalCollegeById, updateInternationalCollege } from "../../api/api";
import toast from "react-hot-toast";
import ConfirmModal from "../college/ConfirmModal";
import { useParams } from "react-router-dom";
import slugify from "slugify";
import ReactQuill from "react-quill";

export default function EditInternationalCollege() {
    const { id } = useParams<any>();
    const [data, setData] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch college
    useEffect(() => {
        getInternationalCollegeById(id)
            .then((res) => {
                setData(res.data.data);
            })
            .catch(() => toast.error("Failed to load college"));
    }, [id]);

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

    const handleUpdate = async (e: any) => {
        e.preventDefault();

        if (!data.name || !data.slug || !data.location) {
            toast.error("Name, Slug and Location are required");
            return;
        }

        try {
            await updateInternationalCollege(id, data);

            toast.success("International College Updated Successfully");

            setTimeout(() => {
                globalThis.location.href = "/international-colleges";
            }, 1000);

        } catch (err: any) {
            toast.error(err?.message || "Update Failed");
        }
    };

    if (!data) return <p>Loading...</p>;

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">
                Edit International College "{data.name}"
            </p>

            <div className="add-adminForm">

                {/* Name */}
                <label className="add-adminLabel">College Name *</label>
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

                {/* Location */}
                <label className="add-adminLabel">Location *</label>
                <input
                    className="add-adminInput"
                    id="location"
                    value={data.location || ""}
                    onChange={handleChange}
                />

                {/* Description */}
                <label className="add-adminLabel">Description</label>
                <ReactQuill
                    theme="snow"
                    value={data.description || ""}
                    onChange={(value) =>
                        setData((prev: any) => ({
                            ...prev,
                            description: value,
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
                    Update International College
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