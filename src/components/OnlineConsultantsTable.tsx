import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteConsultant, getAllConsultants } from "../api/api";

const OnlineConsultantsTable = () => {
    const [data, setData] = useState<any[]>([]);
    const [dupData, setDupData] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // ✅ Load when page changes
    useEffect(() => {
        loadConsultationData(page);
    }, [page]);

    const loadConsultationData = async (pageNumber = page) => {
        try {
            const res = await getAllConsultants(pageNumber, limit);

            const apiData =
                res?.data ??
                (Array.isArray(res) ? res : []);

            setData(apiData);
            setDupData(apiData);

            setTotalPages(res?.totalPages ?? res?.total_pages ?? 1);
        } catch {
            toast.error("Failed to load data");
        }
    };

    // 🔍 Local Search (only current page)
    const handleSearch = (query: string) => {
        setSearch(query);

        if (!query) {
            setData(dupData);
            return;
        }

        const filtered = dupData.filter((p: any) =>
            p.fullName?.toLowerCase().includes(query.toLowerCase())
        );

        setData(filtered);
    };

    // ❌ Delete
    const handleDelete = async (id: number) => {
        if (!globalThis.confirm("Are you sure you want to delete ?")) return;

        try {
            await deleteConsultant(id);
            toast.success("Deleted");

            setData(prev => prev.filter(p => p.id !== id));
            setDupData(prev => prev.filter(p => p.id !== id));
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <>
            {/* Search */}
            <div className="mb-4 sm:max-w-sm">
                <input
                    type="text"
                    placeholder="Search query..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="admin-input"
                />
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-2 text-black dark:bg-meta-4 dark:text-white">
                            <tr>
                                <th className="admin-table-th">#</th>
                                <th className="admin-table-th">Full Name</th>
                                <th className="admin-table-th">Email</th>
                                <th className="admin-table-th">Phone</th>
                                <th className="admin-table-th">Message</th>
                                <th className="admin-table-th">Course Interest</th>
                                <th className="admin-table-th">Preferred Time</th>
                                <th className="admin-table-th">Preferred City</th>
                                <th className="admin-table-th">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-6 text-black dark:text-white">
                                        No Data
                                    </td>
                                </tr>
                            ) : (
                                data.map((p, index) => (
                                    <tr key={p.id}>
                                        <td className="admin-table-td">
                                            {(page - 1) * limit + index + 1}
                                        </td>

                                        <td className="admin-table-td">
                                           {p.fullName}
                                        </td>

                                        <td className="admin-table-td">{p.email}</td>
                                        <td className="admin-table-td">{p.phone || "—"}</td>
                                        <td className="admin-table-td">{p.message || "—"}</td>
                                        <td className="admin-table-td">{p.courseInterest || "—"}</td>
                                        <td className="admin-table-td">{p.preferredConsultationDate || "—"}&nbsp;{p.preferredTime || "-"}</td>
                                        <td className="admin-table-td">{p.preferredStateCity || "—"}</td>
                                        <td className="admin-table-td">
                                            <div className="flex gap-3">
                                                <button className="rounded-xl bg-danger px-4 py-2 text-white hover:opacity-90" onClick={() => handleDelete(p.id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* ✅ Pagination */}
                    <div className="flex justify-center gap-4 mt-4 text-black dark:text-white">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Prev
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OnlineConsultantsTable;