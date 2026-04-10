import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createFee, getFeesByCourse, deleteFee } from "../../../api/api";
import ConfirmModal from "../ConfirmModal";
import FeeList from "./tables/FeesList";

export default function FeesTab({ courseId }: any) {
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");
  const [fees, setFees] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    year: "",
    tuitionFee: "",
    hostelFee: "",
    examFee: "",
    otherFee: "",
    totalFee: 0,
  });

  // 🔹 Fetch fees
  const fetchFees = async () => {
    try {
      const res = await getFeesByCourse(courseId);
      setFees(res.data.data);
    } catch {
      toast.error("Failed to load fees");
    }
  };

  useEffect(() => {
    fetchFees();
  }, [courseId]);

  // 🔹 Auto total calculation
  useEffect(() => {
    const total =
      Number(form.tuitionFee || 0) +
      Number(form.hostelFee || 0) +
      Number(form.examFee || 0) +
      Number(form.otherFee || 0);

    setForm((prev) => ({ ...prev, totalFee: total }));
  }, [form.tuitionFee, form.hostelFee, form.examFee, form.otherFee]);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  // 🔹 Create Fee
  const handleCreate = async () => {
    if (!form.year || !form.tuitionFee) {
      toast.error("Year and Tuition Fee are required");
      return;
    }

    // Prevent duplicate year
    if (fees.some((f) => f.year === form.year)) {
      toast.error("Fee for this year already exists");
      return;
    }

    try {
      await createFee({
        courseId,
        year: form.year,
        tuitionFee: Number(form.tuitionFee),
        hostelFee: Number(form.hostelFee || 0),
        examFee: Number(form.examFee || 0),
        otherFee: Number(form.otherFee || 0),
        totalFee: form.totalFee,
      });

      toast.success("Fee added successfully");
      setShowModal(false);
      setActiveTab("list");

      setForm({
        year: "",
        tuitionFee: "",
        hostelFee: "",
        examFee: "",
        otherFee: "",
        totalFee: 0,
      });

      fetchFees();
    } catch (err: any) {
      toast.error(err.message || "Failed to add fee");
    }
  };

  // 🔹 Delete Fee
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this fee?")) return;

    try {
      await deleteFee(id);
      toast.success("Fee deleted");
      fetchFees();
    } catch {
      toast.error("Failed to delete fee");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Fees</h3>
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
          <label className="add-adminLabel">Year *</label>
          <input
            className="add-adminInput"
            id="year"
            placeholder="Enter Year e.g. 1st Year"
            value={form.year}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Tuition Fee *</label>
          <input
            className="add-adminInput"
            id="tuitionFee"
            type="number"
            placeholder="Enter Tuition Fee e.g. 10000"
            value={form.tuitionFee}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Hostel Fee</label>
          <input
            className="add-adminInput"
            id="hostelFee"
            placeholder="Enter Hostel Fee (if any) eg. 5000"
            type="number"
            value={form.hostelFee}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Exam Fee</label>
          <input
            className="add-adminInput"
            id="examFee"
            type="number"
            placeholder="Enter Exam Fee (if any) eg. 2000"
            value={form.examFee}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Other Fee</label>
          <input
            className="add-adminInput"
            id="otherFee"
            type="number"
            placeholder="Enter Other Fee (if any) eg. 1000"
            value={form.otherFee}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Total Fee</label>
          <input className="add-adminInput bg-gray-100" value={form.totalFee} readOnly />

          <button
            className="add-adminButton mt-4"
            onClick={() => setShowModal(true)}
          >
            Add Fee
          </button>

          {/* Confirmation Modal */}
          {showModal && (
            <ConfirmModal setShowModal={setShowModal} handleCreate={handleCreate} />
          )}
        </div>
      )}

      {/* 🔹 LIST TAB */}
      {activeTab === "list" && (
        <FeeList fees={fees} handleDelete={handleDelete} />
      )}
    </div>
  );
}