import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createAdmission,
  getAdmissionsByCollege,
  deleteAdmission,
} from "../../../api/api";
import ConfirmModal from "../ConfirmModal";
import AdmissionList from "./tables/AdmissionList";
import ReactQuill from "react-quill";

export default function AdmissionTab({ collegeId }: any) {
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    process: "",
    eligibility: "",
    entranceExams: "",
    applicationStart: "",
    applicationEnd: "",
    admissionResults: "",
    interviewDates: [""],
  });

  // 🔹 Fetch admissions
  const fetchAdmissions = async () => {
    try {
      const res = await getAdmissionsByCollege(collegeId);
      setAdmissions(res.data.data);
    } catch {
      toast.error("Failed to load admissions");
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [collegeId]);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleInterviewChange = (index: number, value: string) => {
    const updated = [...form.interviewDates];
    updated[index] = value;
    setForm({ ...form, interviewDates: updated });
  };

  const addInterviewDate = () => {
    setForm({ ...form, interviewDates: [...form.interviewDates, ""] });
  };

  // 🔹 Create Admission
  const handleCreate = async () => {
    if (!form.process || !form.eligibility) {
      toast.error("Process and Eligibility are required");
      return;
    }

    try {
      await createAdmission({
        collegeId,
        process: form.process,
        eligibility: form.eligibility,
        entranceExams: form.entranceExams,
        importantDates: {
          applicationStart: form.applicationStart,
          applicationEnd: form.applicationEnd,
          admissionResults: form.admissionResults,
          interviewDates: form.interviewDates.filter(Boolean),
        },
      });

      toast.success("Admission added successfully");
      setShowModal(false);
      setActiveTab("list");

      setForm({
        process: "",
        eligibility: "",
        entranceExams: "",
        applicationStart: "",
        applicationEnd: "",
        admissionResults: "",
        interviewDates: [""],
      });

      fetchAdmissions();
    } catch (err: any) {
      toast.error(err.message || "Failed to add admission");
    }
  };

  // 🔹 Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this admission?")) return;

    try {
      await deleteAdmission(id);
      toast.success("Admission deleted");
      fetchAdmissions();
    } catch {
      toast.error("Failed to delete admission");
    }
  };

  return (
    <div >
      <h3 className="text-xl font-bold mb-4">Admissions</h3>

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
          <label className="add-adminLabel">Process *</label>
          <ReactQuill
            theme="snow"
            value={form.process}
            placeholder="Enter Admission Process eg. 1. Apply online 2. Entrance Exam 3. Interview"
            onChange={(value) =>
              setForm((prev: any) => ({
                ...prev,
                process: value,
              }))
            }
            className="bg-white mb-4 text-black"
          />

          <label className="add-adminLabel">Eligibility *</label>
          <ReactQuill
            theme="snow"
            value={form.eligibility}
            placeholder="Enter eligibility criteria eg. 10+2 with 75% and above, JEE Main score etc."
            onChange={(value) =>
              setForm((prev: any) => ({
                ...prev,
                eligibility: value,
              }))
            }
            className="bg-white mb-4 text-black"
          />

          <label className="add-adminLabel">Entrance Exams</label>
          <ReactQuill
            theme="snow"
            value={form.entranceExams}
            placeholder="Enter Entrance Exams eg. JEE Main, BITSAT, VITEEE etc."
            onChange={(value) =>
              setForm((prev: any) => ({
                ...prev,
                entranceExams: value,
              }))
            }
            className="bg-white mb-4 text-black"
          />

          <label className="add-adminLabel">Application Start</label>
          <input
            type="date"
            className="add-adminInput"
            id="applicationStart"
            value={form.applicationStart}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Application End</label>
          <input
            type="date"
            className="add-adminInput"
            id="applicationEnd"
            value={form.applicationEnd}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Admission Results</label>
          <input
            type="date"
            className="add-adminInput"
            id="admissionResults"
            value={form.admissionResults}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Interview Dates</label>
          {form.interviewDates.map((date, i) => (
            <input
              key={i}
              type="date"
              className="add-adminInput mb-2"
              value={date}
              onChange={(e) =>
                handleInterviewChange(i, e.target.value)
              }
            />
          ))}

          <button
            className="text-blue-500 mb-3"
            onClick={addInterviewDate}
          >
            + Add another date
          </button>

          <button
            className="add-adminButton mt-4"
            onClick={() => setShowModal(true)}
          >
            Add Admission
          </button>

          {/* Modal */}
          {showModal && (
            <ConfirmModal setShowModal={setShowModal} handleCreate={handleCreate} />
          )}
        </div>
      )}

      {/* 🔹 LIST TAB */}
      {activeTab === "list" && (
        <AdmissionList admissions={admissions} handleDelete={handleDelete} />
      )}
    </div>
  );
}