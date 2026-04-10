import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createCutoff,
  getCutoffsByCollege,
  deleteCutoff,
} from "../../../api/api";
import CutoffList from "./tables/CutoffList";

export default function CutoffTab({ collegeId }: any) {
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");
  const [cutoffs, setCutoffs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    courseName: "",
    exam: "",
    year: "",
    closingRank: "",
  });

  // 🔹 Fetch cutoffs
  const fetchCutoffs = async () => {
    try {
      const res = await getCutoffsByCollege(collegeId);
      setCutoffs(res.data.data);
    } catch {
      toast.error("Failed to load cutoffs");
    }
  };

  useEffect(() => {
    fetchCutoffs();
  }, [collegeId]);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  // 🔹 Create cutoff
  const handleCreate = async () => {
    if (!form.courseName || !form.exam || !form.year || !form.closingRank) {
      toast.error("All fields are required");
      return;
    }

    try {
      await createCutoff({
        collegeId,
        courseName: form.courseName,
        exam: form.exam,
        year: Number(form.year),
        closingRank: form.closingRank,
      });

      toast.success("Cutoff added successfully");
      setShowModal(false);
      setActiveTab("list");

      setForm({
        courseName: "",
        exam: "",
        year: "",
        closingRank: "",
      });

      fetchCutoffs();
    } catch (err: any) {
      toast.error(err.message || "Failed to add cutoff");
    }
  };

  // 🔹 Delete cutoff
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this cutoff?")) return;

    try {
      await deleteCutoff(id);
      toast.success("Cutoff deleted");
      fetchCutoffs();
    } catch {
      toast.error("Failed to delete cutoff");
    }
  };

  return (
    <div >
      <h3 className="text-xl font-bold mb-4">CutOff</h3>

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
      
      {/* 🔹 ADD TAB */}
      {activeTab === "add" && (
        <div className="add-adminForm">
          <label className="add-adminLabel">Course Name *</label>
          <input
            className="add-adminInput"
            id="courseName"
            placeholder="e.g. Computer Engineering"
            value={form.courseName}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Entrance Exam *</label>
          <input
            className="add-adminInput"
            id="exam"
            placeholder="e.g. JEE Main"
            value={form.exam}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Year *</label>
          <input
            type="number"
            className="add-adminInput"
            id="year"
            placeholder="e.g. 2025"
            value={form.year}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Closing Rank *</label>
          <input
            className="add-adminInput"
            id="closingRank"
            placeholder="e.g. 4521"
            value={form.closingRank}
            onChange={handleChange}
          />

          <button
            className="add-adminButton mt-4"
            onClick={() => setShowModal(true)}
          >
            Add Cutoff
          </button>

          {/* Confirmation Modal */}
          {showModal && (
            <>
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-lg w-96">
                  <h3 className="text-xl font-semibold mb-4">Confirmation</h3>
                  <p>Are you sure you want to add this cutoff?</p>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      className="text-red-500 font-bold"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-emerald-500 px-4 py-2 rounded"
                      onClick={handleCreate}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 bg-black"></div>
            </>
          )}
        </div>
      )}

      {/* 🔹 LIST TAB */}
      {activeTab === "list" && (
        <CutoffList cutoffs={cutoffs} handleDelete={handleDelete} />
      )}
    </div>
  );
}