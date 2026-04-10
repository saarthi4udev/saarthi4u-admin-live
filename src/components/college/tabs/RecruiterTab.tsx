import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createRecruiter, getRecruitersByCollege, deleteRecruiter } from "../../../api/api";
import ConfirmModal from "../ConfirmModal";
import RecruiterList from "./tables/RecruiterList";

export default function RecruiterTab({ collegeId }: any) {
    const [activeTab, setActiveTab] = useState<"add" | "list">("add");
    const [recruiters, setRecruiters] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        name: "",
    });

    const fetchRecruiters = async () => {
        const res = await getRecruitersByCollege(collegeId);
        setRecruiters(res.data.data);
    };

    useEffect(() => {
        fetchRecruiters();
    }, [collegeId]);

    const handleChange = (e: any) =>
        setForm({ ...form, [e.target.id]: e.target.value });

    const handleCreate = async () => {
        if (!form.name)
            return toast.error("All fields required");

        await createRecruiter({ ...form, collegeId });
        toast.success("Recruiter added successfully");
        setShowModal(false);
        setActiveTab("list");
        setForm({ name: "" });
        fetchRecruiters();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete Recruiter?")) return;
        await deleteRecruiter(id);
        fetchRecruiters();
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Recruiters</h3>

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
                    <textarea id="name" placeholder="Enter Recruiter Name eg. Google, Microsoft" onChange={handleChange} className="add-adminInput" />

                    <button className="add-adminButton mt-4" onClick={() => setShowModal(true)}>
                        Add Recruiter
                    </button>

                    {showModal && (
                        <ConfirmModal setShowModal={setShowModal} handleCreate={handleCreate} />
                    )}
                </div>
            )}

            {activeTab === "list" && (
                <RecruiterList recruiters={recruiters} handleDelete={handleDelete} />
            )}
        </div>
    );
}