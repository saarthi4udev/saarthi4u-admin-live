import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createFacility,
  getFacilitiesByCollege,
  deleteFacility,
} from "../../../api/api";
import ConfirmModal from "../ConfirmModal";
import FacilityList from "./tables/FacilityList";
import ReactQuill from "react-quill";

export default function FacilityTab({ collegeId }: any) {
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");
  const [facilities, setFacilities] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const fetchFacilities = async () => {
    try {
      const res = await getFacilitiesByCollege(collegeId);
      setFacilities(res.data.data);
    } catch {
      toast.error("Failed to load facilities");
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [collegeId]);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleCreate = async () => {
    if (!form.name) return toast.error("Facility name required");

    try {
      await createFacility({ ...form, collegeId });
      toast.success("Facility added");
      setShowModal(false);
      setActiveTab("list");
      setForm({ name: "", description: "" });
      fetchFacilities();
    } catch {
      toast.error("Failed to add facility");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete facility?")) return;
    await deleteFacility(id);
    fetchFacilities();
  };

  return (
    <div className="tab-wrapper">
      <h3 className="text-xl font-bold mb-4">Facilities</h3>

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

      {/* ADD */}
      {activeTab === "add" && (
        <div className="add-adminForm">
          <label className="add-adminLabel">Facility Name *</label>
          <input className="add-adminInput" placeholder="Enter Facility Name e.g. Library" id="name" onChange={handleChange} />

          <label className="add-adminLabel">Description</label>
          <ReactQuill
            theme="snow"
            value={form.description || ""}
            placeholder="Enter description of the facility e.g. The college has a well-equipped library with 1000+ books and journals."
            onChange={(value) =>
              setForm((prev: any) => ({
                ...prev,
                description: value,
              }))
            }
            className="bg-white mb-4 text-black"
          />

          <button className="add-adminButton mt-4" onClick={() => setShowModal(true)}>
            Add Facility
          </button>

          {showModal && (
            <ConfirmModal handleCreate={handleCreate} setShowModal={setShowModal} />
          )}
        </div>
      )}

      {/* LIST */}
      {activeTab === "list" && (
        <FacilityList facilitys={facilities} handleDelete={handleDelete} />
      )}
    </div>
  );
}