import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createFaculty,
  getFacultiesByCollege,
  deleteFaculty,
} from "../../../api/api";
import ConfirmModal from "../ConfirmModal";
import FacultyList from "./tables/FacultyList";

export default function FacultyTab({ collegeId }: any) {
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");
  const [faculty, setFaculty] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    designation: "",
    qualification: "",
    experience: "",
  });

  const fetchFaculty = async () => {
    const res = await getFacultiesByCollege(collegeId);
    setFaculty(res.data.data);
  };

  useEffect(() => {
    fetchFaculty();
  }, [collegeId]);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.id]: e.target.value });

  const handleCreate = async () => {
    if (!form.name) return toast.error("Name required");

    await createFaculty({ ...form, collegeId });
    toast.success("Faculty added");
    setShowModal(false);
    setActiveTab("list");
    setForm({ name: "", designation: "", qualification: "", experience: "" });
    fetchFaculty();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete faculty?")) return;
    await deleteFaculty(id);
    fetchFaculty();
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Faculty</h3>

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
          <input className="add-adminInput" id="name" placeholder="Enter Name eg. Dr. John Smith" onChange={handleChange} />
          <input className="add-adminInput" id="designation" placeholder="Enter Designation eg. Professor" onChange={handleChange} />
          <input className="add-adminInput" id="qualification" placeholder="Enter Qualification eg. M.Sc., Ph.D." onChange={handleChange} />
          <input className="add-adminInput" id="experience" placeholder="Enter Experience eg. 10 years" onChange={handleChange} />

          <button className="add-adminButton mt-4" onClick={() => setShowModal(true)}>
            Add Faculty
          </button>

          {showModal && (
            <ConfirmModal setShowModal={setShowModal} handleCreate={handleCreate} />
          )}
        </div>
      )}

      {activeTab === "list" && (
       <FacultyList facultys={faculty} handleDelete={handleDelete} />
      )}
    </div>
  );
}