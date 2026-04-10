import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createPlacement, getPlacementsByCollege, deletePlacement } from "../../../api/api";
import ConfirmModal from "../ConfirmModal";
import PlacementList from "./tables/PlacementList";

export default function PlacementTab({ collegeId }: any) {
    const [activeTab, setActiveTab] = useState<"add" | "list">("add");
    const [placements, setPlacements] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        year: "",
        highestPackage: "",
        averagePackage: "",
        placementRate: "",
        totalPlaced: 0
    });

    const fetchPlacement = async () => {
        const res = await getPlacementsByCollege(collegeId);
        setPlacements(res.data.data);
    };

    useEffect(() => {
        fetchPlacement();
    }, [collegeId]);

    const handleChange = (e: any) =>
        setForm({ ...form, [e.target.id]: e.target.value });

    const handleCreate = async () => {
        if (!form.year || !form.highestPackage)
            return toast.error("All fields required");

        await createPlacement({ ...form, collegeId });
        toast.success("Placement added successfully");
        setShowModal(false);
        setActiveTab("list");
        setForm({ year: "", highestPackage: "", averagePackage: "", placementRate: "", totalPlaced: 0 });
        fetchPlacement();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete Placement?")) return;
        await deletePlacement(id);
        fetchPlacement();
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Placements</h3>

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
                    <textarea id="year" placeholder="Enter Year eg. 2026" onChange={handleChange} className="add-adminInput" />
                    <textarea id="highestPackage" placeholder="Enter Highest Package e.g. 12 LPA" onChange={handleChange} className="add-adminInput" />
                    <textarea id="averagePackage" placeholder="Enter Average Package e.g. 8 LPA" onChange={handleChange} className="add-adminInput" />
                    <textarea id="placementRate" placeholder="Enter Placement Rate e.g. 95%" onChange={handleChange} className="add-adminInput" />
                    <textarea id="totalPlaced" placeholder="Enter Total Placed Students e.g. 120" onChange={handleChange} className="add-adminInput" />

                    <button className="add-adminButton mt-4" onClick={() => setShowModal(true)}>
                        Add Placement
                    </button>

                    {showModal && (
                        <ConfirmModal setShowModal={setShowModal} handleCreate={handleCreate} />
                    )}
                </div>
            )}

            {activeTab === "list" && (
                <PlacementList placements={placements} handleDelete={handleDelete} />
            )}
        </div>
    );
}