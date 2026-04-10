import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createGalleryImage, getGalleryByCollege, deleteGalleryImage } from "../../../api/api";
import ConfirmModal from "../ConfirmModal";
import GalleryList from "./tables/GalleryList";

export default function GalleryTab({ collegeId }: any) {
    const [activeTab, setActiveTab] = useState<"add" | "list">("add");
    const [gallery, setGallery] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        caption: "",
    });
    const [imageUrl, setImageUrl] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);


    const fetchGalleryImages = async () => {
        const res = await getGalleryByCollege(collegeId);
        setGallery(res.data.data);
    };

    useEffect(() => {
        fetchGalleryImages();
    }, [collegeId]);

    useEffect(() => {
        return () => {
            // Revoke the object URL to free memory when component unmounts or image changes
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (e: any) =>
        setForm({ ...form, [e.target.id]: e.target.value });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageUrl(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreate = async () => {
        if (!imageUrl || !form.caption)
            return toast.error("All fields required");

        try {
            const formData = new FormData();
            formData.append("imageUrl", imageUrl);
            formData.append("collegeId", collegeId);
            formData.append("caption", form.caption);
            await createGalleryImage(formData);
            toast.success("Gallery Image added successfully");
            setShowModal(false);
            //clear form
            setForm({
                caption: "",
            });
            setImageUrl(null);
            setImagePreview(null);
            setActiveTab("list");
            fetchGalleryImages();
        } catch (error) {
            console.error(error);
            toast.error("Error adding gallery image");
        }

    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete Gallery Image?")) return;
        await deleteGalleryImage(id);
        fetchGalleryImages();
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Gallery Images</h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("add")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "add"
                        ? "bg-primary text-white shadow"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                >
                    Add
                </button>

                <button
                    onClick={() => setActiveTab("list")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "list"
                        ? "bg-primary text-white shadow"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                >
                    Existing
                </button>
            </div>

            {activeTab === "add" && (
                <div className="add-adminForm">
                    <label className="add-adminLabel">Gallery Image *</label>
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
                                onClick={() => { setImageUrl(null); setImagePreview(null); }}
                                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    <textarea id="caption" placeholder="Enter Caption e.g. College Campus" onChange={handleChange} className="add-adminInput" />

                    <button className="add-adminButton mt-4" onClick={() => setShowModal(true)}>
                        Add Gallery Image
                    </button>

                    {showModal && (
                        <ConfirmModal setShowModal={setShowModal} handleCreate={handleCreate} />
                    )}
                </div>
            )}

            {activeTab === "list" && (
                <GalleryList gallerys={gallery} handleDelete={handleDelete} />
            )}
        </div>
    );
}