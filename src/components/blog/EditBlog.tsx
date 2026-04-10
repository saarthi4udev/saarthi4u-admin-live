import { useEffect, useState } from "react";
import { getBlogById, updateBlog, getAllCategories } from "../../api/api";
import toast from "react-hot-toast";
import ConfirmModal from "../college/ConfirmModal";
import { useParams } from "react-router-dom";
import slugify from "slugify";
import ReactQuill from "react-quill";

export default function EditBlog() {
    const { id } = useParams<any>();
    const [data, setData] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [blogId, setBlogId] = useState<string | null>(null);

    // Fetch Blog
    useEffect(() => {
        getBlogById(id)
            .then((res) => {
                const blog = res.data.data;
                setData(blog);
                setBlogId(blog.id);
                // ✅ set existing image as initial preview
                if (blog.featuredImage) {
                    setImagePreview(blog.featuredImage);
                }
            })
            .catch(() => toast.error("Failed to load Blog"));

        getAllCategories()
            .then((res) => setCategories(res.data.data))
            .catch(() => toast.error("Failed to load categories"));
    }, [id]);

    // ✅ Cleanup blob URL on unmount to avoid memory leaks
    useEffect(() => {
        return () => {
            if (newImageFile && imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview, newImageFile]);

    const handleChange = (e: any) => {
        const { id, value, type, checked } = e.target;

        setData((prev: any) => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
            ...(id === "title" && {
                slug: slugify(value, { lower: true, strict: true }),
            }),
        }));
    };

    // ✅ Handle new image file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // ✅ Remove selected image
    const handleRemoveImage = () => {
        setNewImageFile(null);
        setImagePreview(null);
        setData((prev: any) => ({ ...prev, featuredImage: "" }));
    };

    const handleUpdate = async (e: any) => {
        e.preventDefault();

        if (!data.title || !data.slug || !data.categoryId) {
            toast.error("Title, Slug and Category are required");
            return;
        }

        try {
            // ✅ Build FormData
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("slug", data.slug);
            formData.append("categoryId", data.categoryId);
            formData.append("excerpt", data.excerpt || "");
            formData.append("content", data.content || "");
            formData.append("metaTitle", data.metaTitle || "");
            formData.append("metaDescription", data.metaDescription || "");
            formData.append("metaKeywords", data.metaKeywords || "");
            formData.append("visible", String(data.visible));
            formData.append("isFeatured", String(data.isFeatured));
            formData.append("publishedAt", data.publishedAt || "");

            if (newImageFile) {
                // ✅ User picked a new image — send the file
                formData.append("featuredImage", newImageFile);
            } else if (data.featuredImage) {
                // ✅ No new file — pass existing URL so backend keeps it
                formData.append("featuredImage", data.featuredImage);
            }
            // ✅ If both are empty, user removed the image — backend will clear it

            await updateBlog(blogId, formData);
            toast.success("Blog Updated Successfully");
            setTimeout(() => {
                globalThis.location.href = "/blogs";
            }, 1000);
        } catch (err: any) {
            toast.error(err?.message || "Blog Update Failed");
        }
    };

    if (!data) return <p>Loading...</p>;

    return (
        <div className="admin-section-card mx-auto w-full max-w-4xl">
            <h2 className="admin-section-title">
                Edit Blog "{data.title}"
            </h2>

            <div className="admin-form-grid">

                {/* Title */}
                <div>
                    <label className="admin-label">Blog Title *</label>
                    <input
                        className="admin-input"
                        id="title"
                        value={data.title || ""}
                        placeholder="Enter blog title"
                        onChange={handleChange}
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="admin-label">Slug *</label>
                    <input
                        className="admin-input"
                        id="slug"
                        value={data.slug || ""}
                        placeholder="Auto-generated from title"
                        readOnly
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="admin-label">Category *</label>
                    <select
                        className="admin-input"
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
                </div>

                {/* Excerpt */}
                <div>
                    <label className="admin-label">Excerpt</label>
                    <ReactQuill
                        theme="snow"
                        value={data.excerpt || ""}
                        placeholder="Short summary..."
                        onChange={(value) =>
                            setData((prev: any) => ({ ...prev, excerpt: value }))
                        }
                        className="bg-white mb-4 text-black"
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="admin-label">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={data.content || ""}
                        placeholder="Write detailed blog content here..."
                        onChange={(value) =>
                            setData((prev: any) => ({ ...prev, content: value }))
                        }
                        className="bg-white mb-4 text-black"
                    />
                </div>

                {/* Featured Image */}
                <div>
                    <label className="admin-label">Featured Image</label>
                    <input
                        type="file"
                        className="admin-input"
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    {/* ✅ Image Preview */}
                    {imagePreview && (
                        <div className="mt-2 mb-4 relative w-fit">
                            <img
                                src={imagePreview}
                                alt="Featured Preview"
                                className="h-48 w-auto rounded-md object-cover border border-gray-300"
                            />
                            {/* ✅ Badge to indicate source */}
                            <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                                {newImageFile ? "New Image" : "Current Image"}
                            </span>
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                {/* SEO Section */}
                <div>
                    <label className="admin-label">Meta Title</label>
                    <input
                        className="admin-input"
                        id="metaTitle"
                        value={data.metaTitle || ""}
                        placeholder="SEO title (60 characters max)"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="admin-label">Meta Description</label>
                    <ReactQuill
                        theme="snow"
                        value={data.metaDescription || ""}
                        placeholder="SEO description (150–160 characters)"
                        onChange={(value) =>
                            setData((prev: any) => ({ ...prev, metaDescription: value }))
                        }
                        className="bg-white mb-4 text-black"
                    />
                </div>

                <div>
                    <label className="admin-label">Meta Keywords</label>
                    <input
                        className="admin-input"
                        id="metaKeywords"
                        value={data.metaKeywords || ""}
                        placeholder="engineering colleges, IIT, NIT, India 2026"
                        onChange={handleChange}
                    />
                </div>

                {/* Publish Date */}
                <div>
                    <label className="admin-label">Published At</label>
                    <input
                        type="datetime-local"
                        className="admin-input"
                        id="publishedAt"
                        value={
                            data.publishedAt
                                ? new Date(data.publishedAt).toISOString().slice(0, 16)
                                : ""
                        }
                        onChange={handleChange}
                    />
                </div>

                {/* Toggles */}
                <div className="flex gap-6 mt-3">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="visible"
                            checked={data.visible}
                            onChange={handleChange}
                        />
                        Visible on Website
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isFeatured"
                            checked={data.isFeatured}
                            onChange={handleChange}
                        />
                        Featured Blog
                    </label>
                </div>

                {/* Submit */}
                <button
                    className="admin-btn-primary mt-4"
                    onClick={() => setShowModal(true)}
                >
                    Update Blog
                </button>
            </div>

            {showModal && (
                <ConfirmModal
                    setShowModal={setShowModal}
                    handleCreate={handleUpdate}
                />
            )}
        </div>
    );
}