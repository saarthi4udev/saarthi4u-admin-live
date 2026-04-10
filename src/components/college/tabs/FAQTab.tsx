import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createFAQ, getFAQsByCollege, deleteFAQ } from "../../../api/api";
import ConfirmModal from "../ConfirmModal";
import FAQList from "./tables/FAQList";
import ReactQuill from "react-quill";

export default function FAQTab({ collegeId }: any) {
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");
  const [faqs, setFaqs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    question: "",
    answer: "",
  });

  const fetchFAQs = async () => {
    const res = await getFAQsByCollege(collegeId);
    setFaqs(res.data.data);
  };

  useEffect(() => {
    fetchFAQs();
  }, [collegeId]);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.id]: e.target.value });

  const handleCreate = async () => {
    if (!form.question || !form.answer)
      return toast.error("All fields required");

    await createFAQ({ ...form, collegeId });
    toast.success("FAQ added");
    setShowModal(false);
    setActiveTab("list");
    setForm({ question: "", answer: "" });
    fetchFAQs();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete FAQ?")) return;
    await deleteFAQ(id);
    fetchFAQs();
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">FAQs</h3>

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
          <textarea id="question" placeholder="Enter Question eg. What is the admission process?" onChange={handleChange} className="add-adminInput" />
          <ReactQuill
            theme="snow"
            value={form.answer}
            placeholder="Enter Answer eg. The admission process is..."
            onChange={(value) =>
              setForm((prev: any) => ({
                ...prev,
                answer: value,
              }))
            }
            className="bg-white mb-4 text-black"
          />

          <button className="add-adminButton mt-4" onClick={() => setShowModal(true)}>
            Add FAQ
          </button>

          {showModal && (
            <ConfirmModal setShowModal={setShowModal} handleCreate={handleCreate} />
          )}
        </div>
      )}

      {activeTab === "list" && (
        <FAQList faqs={faqs} handleDelete={handleDelete} />
      )}
    </div>
  );
}