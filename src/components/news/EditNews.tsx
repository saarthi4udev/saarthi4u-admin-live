import { useEffect, useState } from "react";
import { getNewsById, updateNews, getAllCategories } from "../../api/api";
import { useParams } from "react-router-dom";
import slugify from "slugify";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import ConfirmModal from "../college/ConfirmModal";

const EditNews = () => {
    const { id } = useParams<any>();
    const [categories, setCategories] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [data, setData] = useState<any>(null);

    // Load news + categories
    useEffect(() => {
        getNewsById(id)
            .then((res) => setData(res.data.data))
            .catch(() => toast.error("Failed to load news"));

        getAllCategories()
            .then((res) => setCategories(res.data.data))
            .catch(() => toast.error("Failed to load categories"));
    }, [id]);

    const handleChange = (e: any) => {
        const { id, value } = e.target;

        setData((prev: any) => ({
            ...prev,
            [id]: value,
            ...(id === "title" && {
                slug: slugify(value, { lower: true, strict: true }),
            }),
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!data.title || !data.slug || !data.categoryId) {
            toast.error("Please fill required fields");
            return;
        }

        try {
            const res = await updateNews(id, data);

            if (res.status === 200) {
                toast.success("News Updated Successfully");
                setShowModal(false);

                setTimeout(() => {
                    globalThis.location.href = "/news";
                }, 1000);
            }
        } catch (err: any) {
            toast.error(err?.message || "News update failed");
        }
    };

    if (!data) return <p>Loading...</p>;

    return (
        <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
            <p className="font-bold text-secondary text-2xl mb-6">
                Edit News "{data.title || ""}"
            </p>

            <div className="add-adminForm">

                {/* Title */}
                <label className="add-adminLabel">News Title</label>
                <input
                    className="add-adminInput"
                    id="title"
                    value={data.title || ""}
                    placeholder="News Title"
                    onChange={handleChange}
                />

                {/* Slug */}
                <label className="add-adminLabel">News Slug</label>
                <input
                    className="add-adminInput"
                    value={data.slug || ""}
                    readOnly
                />

                {/* Category */}
                <label className="add-adminLabel">Category</label>
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

                {/* Featured Image */}
                <label className="add-adminLabel">Featured Image</label>
                <input
                    className="add-adminInput"
                    id="featuredImage"
                    value={data.featuredImage || ""}
                    placeholder="Featured Image URL"
                    onChange={handleChange}
                />

                {/* Source */}
                <label className="add-adminLabel">News Source</label>
                <input
                    className="add-adminInput"
                    id="source"
                    value={data.source || ""}
                    placeholder="Source"
                    onChange={handleChange}
                />

                {/* Published At */}
                <label className="add-adminLabel">Published At</label>
                <input
                    type="datetime-local"
                    id="publishedAt"
                    className="add-adminInput"
                    value={
                        data.publishedAt
                            ? new Date(data.publishedAt).toISOString().slice(0, 16)
                            : ""
                    }
                    onChange={handleChange}
                />

                {/* Summary */}
                <label className="add-adminLabel">Summary</label>
                <ReactQuill
                    theme="snow"
                    value={data.summary || ""}
                    onChange={(value) =>
                        setData({ ...data, summary: value })
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* Content */}
                <label className="add-adminLabel">Content</label>
                <ReactQuill
                    theme="snow"
                    value={data.content || ""}
                    onChange={(value) =>
                        setData({ ...data, content: value })
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* SEO */}
                <label className="add-adminLabel">SEO Title</label>
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
                    placeholder="Meta Description"
                    onChange={(value) =>
                        setData({ ...data, metaDescription: value })
                    }
                    className="bg-white mb-4 text-black"
                />

                {/* Visibility + Breaking */}
                <div className="flex gap-4 mt-3">
                    <label>
                        <input
                            type="checkbox"
                            checked={data.visible || false}
                            onChange={(e) =>
                                setData({ ...data, visible: e.target.checked })
                            }
                        />
                        Visible
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={data.isBreaking || false}
                            onChange={(e) =>
                                setData({ ...data, isBreaking: e.target.checked })
                            }
                        />
                        Breaking News
                    </label>
                </div>

                <button
                    className="add-adminButton mt-4"
                    onClick={() => setShowModal(true)}
                >
                    Update News
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

export default EditNews;