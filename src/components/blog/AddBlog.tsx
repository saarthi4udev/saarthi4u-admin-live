import React, { useEffect, useState } from "react";
import { createBlog, getAllCategories } from "../../api/api";
import toast from "react-hot-toast";
import slugify from "slugify";
import ConfirmModal from "../college/ConfirmModal";
import ReactQuill from "react-quill";

const AddBlog: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [data, setData] = useState<{
        title: string;
        slug: string;
        categoryId: string;
        excerpt: string;
        content: string;
        featuredImage: File | null;
        metaTitle: string;
        metaDescription: string;
        metaKeywords: string;
        visible: boolean;
        isFeatured: boolean;
        publishedAt: string;
    }>({
        title: "",
        slug: "",
        categoryId: "",
        excerpt: "",
        content: "",
        featuredImage: null,
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        visible: true,
        isFeatured: false,
        publishedAt: "",
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Fetch categories
    useEffect(() => {
        getAllCategories()
            .then((res) => setCategories(res.data.data))
            .catch(() => toast.error("Failed to load categories"));
    }, []);

    // Handle input change + slug auto generate
    const handleChange = (e: any) => {
        const { id, value } = e.target;

        setData((prev) => ({
            ...prev,
            [id]: value,
            ...(id === "title" && {
                slug: slugify(value, { lower: true, strict: true }),
            }),
        }));
    };

    // Submit
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!data.title || !data.slug || !data.categoryId || !data.content) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            // Build FormData instead of sending plain object
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("slug", data.slug);
            formData.append("categoryId", data.categoryId);
            formData.append("excerpt", data.excerpt);
            formData.append("content", data.content);
            formData.append("metaTitle", data.metaTitle);
            formData.append("metaDescription", data.metaDescription);
            formData.append("metaKeywords", data.metaKeywords);
            formData.append("visible", String(data.visible));
            formData.append("isFeatured", String(data.isFeatured));
            formData.append("publishedAt", data.publishedAt);

            // Only append file if selected
            if (data.featuredImage) {
                formData.append("featuredImage", data.featuredImage);
            }

            const res = await createBlog(formData);

            if (res.status === 200) {
                toast.success("Blog Created Successfully");
                setShowModal(false);
            } else {
                toast.error("Blog Creation Failed");
            }
        } catch (err: any) {
            toast.error(err?.message || "Blog Creation Failed");
        }
    };

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">
                Add New Blog
            </p>

            <div className="add-adminForm">

                {/* Title */}
                <label className="add-adminLabel">Title *</label>
                <input
                    className="add-adminInput"
                    id="title"
                    placeholder="Enter blog title e.g. Top Engineering Colleges in India 2026"
                    onChange={handleChange}
                />

                {/* Slug */}
                <label className="add-adminLabel">Slug *</label>
                <input
                    className="add-adminInput"
                    id="slug"
                    placeholder="Auto-generated from title (e.g. top-engineering-colleges-india-2026)"
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

                {/* Featured Image */}
                <label className="add-adminLabel">Featured Image</label>
                <input
                    type="file"
                    className="add-adminInput"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setData((prev) => ({ ...prev, featuredImage: file }));
                            setImagePreview(URL.createObjectURL(file));
                        }
                    }}
                />

                {/* Image Preview */}
                {imagePreview && (
                    <div className="mt-2 mb-4 relative w-fit">
                        <img
                            src={imagePreview}
                            alt="Featured Preview"
                            className="h-48 w-auto rounded-md object-cover border border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setData((prev) => ({ ...prev, featuredImage: null }));
                                setImagePreview(null);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Excerpt */}
                <label className="add-adminLabel">Excerpt</label>
                <ReactQuill
                    theme="snow"
                    value={data.excerpt}
                    placeholder="Write detailed blog content here. Include headings, statistics, admission details, fees, placements, and FAQs..."
                    onChange={(value) =>
                        setData((prev) => ({
                            ...prev,
                            excerpt: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* Content */}
                <label className="add-adminLabel">Content *</label>
                <ReactQuill
                    theme="snow"
                    value={data.content}
                    placeholder="Enter featured image URL (e.g. https://yourcdn.com/images/iit-bombay-campus.jpg)"
                    onChange={(value) =>
                        setData((prev) => ({
                            ...prev,
                            content: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* Meta Fields */}
                <label className="add-adminLabel">Meta Title</label>
                <input
                    className="add-adminInput"
                    id="metaTitle"
                    placeholder="SEO Title (60 characters max) e.g. Top Engineering Colleges in India 2026 - Rankings & Fees"
                    onChange={handleChange}
                />

                <label className="add-adminLabel">Meta Description</label>
                <ReactQuill
                    theme="snow"
                    value={data.metaDescription}
                    placeholder="SEO description (150–160 characters). This appears in Google search results. Eg. Source=https:college.com"
                    onChange={(value) =>
                        setData((prev) => ({
                            ...prev,
                            metaDescription: value,
                        }))
                    }
                    className="bg-white mb-4 text-black"
                />

                <label className="add-adminLabel">Meta Keywords</label>
                <input
                    className="add-adminInput"
                    id="metaKeywords"
                    placeholder="Enter keywords separated by commas (e.g. engineering colleges, IIT, NIT, India 2026)"
                    onChange={handleChange}
                />

                {/* Published Date */}
                <label className="add-adminLabel">Publish Date</label>
                <input
                    type="datetime-local"
                    className="add-adminInput"
                    id="publishedAt"
                    placeholder="Select publish date and time"
                    onChange={handleChange}
                />

                {/* Toggles */}
                <div className="flex gap-4 mt-3">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.visible}
                            onChange={(e) =>
                                setData({ ...data, visible: e.target.checked })
                            }
                        />
                        Visible on website (uncheck to hide from users)
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.isFeatured}
                            onChange={(e) =>
                                setData({ ...data, isFeatured: e.target.checked })
                            }
                        />
                        Mark as Featured Blog (appears on homepage)
                    </label>
                </div>

                {/* Submit */}
                <button
                    className="add-adminButton mt-4"
                    onClick={() => setShowModal(true)}
                >
                    Create Blog
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

export default AddBlog;