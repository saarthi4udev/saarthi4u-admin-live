import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createCourse,
  getCoursesByCollege,
  deleteCourse,
} from "../../../api/api";
import FeesTab from "./FeesTab";
import ConfirmModal from "../ConfirmModal";
import CoursesList from "./tables/CourseList";

export default function CoursesTab({ collegeId }: any) {
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    duration: "",
    totalSeats: "",
    level: "UG",
  });

  // 🔹 Load courses
  const loadCourses = async () => {
    const res = await getCoursesByCollege(collegeId);
    setCourses(res.data.data);
  };

  useEffect(() => {
    if (activeTab === "list") loadCourses();
  }, [activeTab]);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleCreate = async () => {
    if (!form.name || !form.duration) {
      toast.error("Course name & duration required");
      return;
    }

    try {
      await createCourse({
        ...form,
        collegeId,
        totalSeats: form.totalSeats ? Number(form.totalSeats) : null,
      });

      toast.success("Course added");
      setForm({
        name: "",
        specialization: "",
        duration: "",
        totalSeats: "",
        level: "UG",
      });

      setActiveTab("list"); // 🔥 switch to list tab
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return;

    await deleteCourse(id);
    toast.success("Course deleted");
    loadCourses();
  };

  // 🔹 If adding fees
  if (selectedCourseId) {
    return <FeesTab courseId={selectedCourseId} />;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Courses</h3>

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

      {/* ================= ADD COURSE TAB ================= */}
      {activeTab === "add" && (
        <div className="add-adminForm">
          <label className="add-adminLabel">Course Name *</label>
          <input
            className="add-adminInput"
            placeholder="Enter Course Name Eg. B.Tech Computer Science"
            id="name"
            value={form.name}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Specialization</label>
          <input
            className="add-adminInput"
            placeholder="Enter Specialization (if any)"
            id="specialization"
            value={form.specialization}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Duration *</label>
          <input
            className="add-adminInput"
            placeholder="Enter Duration Eg. 4 years, 2 years"
            id="duration"
            value={form.duration}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Total Seats</label>
          <input
            className="add-adminInput"
            placeholder="Enter total seats (optional)"
            id="totalSeats"
            type="number"
            value={form.totalSeats}
            onChange={handleChange}
          />

          <label className="add-adminLabel">Level</label>
          <select
            className="add-adminInput"
            id="level"
            value={form.level}
            onChange={handleChange}
          >
            <option value="UG">UG</option>
            <option value="PG">PG</option>
            <option value="Diploma">Diploma</option>
            <option value="PhD">PhD</option>
          </select>

          <button
            className="add-adminButton mt-4"
            onClick={() => setShowModal(true)}
          >
            Add Course
          </button>

          {/* Modal */}
          {showModal && (
            <ConfirmModal setShowModal={setShowModal} handleCreate={handleCreate} />
          )}
        </div>
      )}

      {/* ================= LIST TAB ================= */}
      {activeTab === "list" && (
        <CoursesList courses={courses} handleDelete={handleDelete} setSelectedCourseId={setSelectedCourseId} />
      )}
    </div>
  );
}
