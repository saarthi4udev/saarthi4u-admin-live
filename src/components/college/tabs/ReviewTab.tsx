import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createReview, getReviewsByCollege, deleteReview } from "../../../api/api";
import ConfirmModal from "../ConfirmModal";
import ReviewList from "./tables/ReviewList";

export default function ReviewTab({ collegeId }: any) {
    const [activeTab, setActiveTab] = useState<"add" | "list">("add");
    const [reviews, setReviews] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        userName: "",
        rating: 0,
        comment: "",
    });

    const fetchReviews = async () => {
        const res = await getReviewsByCollege(collegeId);
        setReviews(res.data.data);
    };

    useEffect(() => {
        fetchReviews();
    }, [collegeId]);

    const handleChange = (e: any) =>
        setForm({ ...form, [e.target.id]: e.target.value });

    const handleCreate = async () => {
        if (!form.userName || !form.rating || !form.comment)
            return toast.error("All fields required");

        await createReview({ ...form, collegeId });
        toast.success("Review added successfully");
        setShowModal(false);
        setActiveTab("list");
        setForm({ userName: "", rating: 0, comment: "" });
        fetchReviews();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete Review?")) return;
        await deleteReview(id);
        fetchReviews();
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Reviews</h3>

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
                    <textarea id="userName" placeholder="Enter UserName e.g. John Doe" onChange={handleChange} className="add-adminInput" />
                    <textarea id="rating" placeholder="Enter Rating (1-5) eg. 4" onChange={handleChange} className="add-adminInput" />
                    <textarea id="comment" placeholder="Enter Comment eg. Great college with excellent facilities and faculty." onChange={handleChange} className="add-adminInput" />

                    <button className="add-adminButton mt-4" onClick={() => setShowModal(true)}>
                        Add Review
                    </button>

                    {showModal && (
                        <ConfirmModal setShowModal={setShowModal} handleCreate={handleCreate} />
                    )}
                </div>
            )}

            {activeTab === "list" && (
                <ReviewList reviews={reviews} handleDelete={handleDelete} />
            )}
        </div>
    );
}