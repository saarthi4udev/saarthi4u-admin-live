import { useEffect, useState } from "react";
import { createNews, getAllCategories } from "../../api/api";
import slugify from "slugify";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import ConfirmModal from "../college/ConfirmModal";

const AddNews = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState({
    title: "",
    slug: "",
    categoryId: "",
    summary: "",
    content: "",
    featuredImage: "",
    source: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    visible: true,
    isBreaking: false,
    publishedAt: "",
  });

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!data.title || !data.slug || !data.categoryId) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      const res = await createNews(data);
      if (res.status === 200) {
        toast.success("News Created Successfully");
        setShowModal(false);
      }
    } catch (err: any) {
      toast.error(err?.message || "News creation failed");
    }
  };

  return (
    <div className="col-span-12 px-5 pt-7.5 pb-5 shadow-default">
      <p className="font-bold text-secondary text-2xl mb-6">
        Add News
      </p>

      <div className="add-adminForm">

        <label className="add-adminLabel">News Title</label>
        <input
          className="add-adminInput"
          id="title"
          placeholder="News Title"
          onChange={handleChange}
        />

        <label className="add-adminLabel">News Slug</label>
        <input
          className="add-adminInput"
          value={data.slug}
          readOnly
        />

        <label className="add-adminLabel">Category</label>
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

        <label className="add-adminLabel">Featured Image</label>
        <input
          className="add-adminInput"
          id="featuredImage"
          placeholder="Featured Image URL"
          onChange={handleChange}
        />

        <label className="add-adminLabel">Source</label>
        <input
          className="add-adminInput"
          id="source"
          placeholder="Source (e.g. Official Website)"
          onChange={handleChange}
        />

        <label className="add-adminLabel">Published At</label>
        <input
          type="datetime-local"
          id="publishedAt"
          className="add-adminInput"
          onChange={handleChange}
        />

        <label className="add-adminLabel">Summary</label>
        <ReactQuill
          theme="snow"
          value={data.summary}
          onChange={(value) => setData({ ...data, summary: value })}
          className="bg-white mb-4 text-black"
        />

        <label className="add-adminLabel">Content</label>
        <ReactQuill
          theme="snow"
          value={data.content}
          onChange={(value) => setData({ ...data, content: value })}
          className="bg-white mb-4 text-black"
        />

        <label className="add-adminLabel">SEO Title</label>
        <input
          className="add-adminInput"
          id="metaTitle"
          placeholder="SEO Title"
          onChange={handleChange}
        />

        <label className="add-adminLabel">SEO Keywords</label>
        <input
          className="add-adminInput"
          id="metaKeywords"
          placeholder="SEO Keywords"
          onChange={handleChange}
        />

        <label className="add-adminLabel">Meta Description</label>
        <ReactQuill
          theme="snow"
          value={data.metaDescription}
          placeholder="Meta Description"
          onChange={(value) =>
            setData({ ...data, metaDescription: value })
          }
          className="bg-white mb-4 text-black"
        />

        <div className="flex gap-4 mt-3">
          <label>
            <input
              type="checkbox"
              checked={data.visible}
              onChange={(e) =>
                setData({ ...data, visible: e.target.checked })
              }
            />
            Visible
          </label>

          <label>
            <input
              type="checkbox"
              checked={data.isBreaking}
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
          Create News
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

export default AddNews;