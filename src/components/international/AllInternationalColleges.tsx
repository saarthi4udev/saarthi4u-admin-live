import { useEffect, useState } from "react";
import { getAllInternationalColleges, deleteInternationalCollege } from "../../api/api";
import toast from "react-hot-toast";

const AllInternationalColleges = () => {
    const [data, setData] = useState<any[]>([]);
    const [dupData, setDupData] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        loadColleges();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const totalPages = Math.ceil(data.length / rowsPerPage);

    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const loadColleges = async () => {
        try {
            const res = await getAllInternationalColleges();
            setData(res.data.data);
            setDupData(res.data.data);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load colleges");
        }
    };

    // 🔍 Search filter
    const handleSearch = (query: string) => {
        setSearch(query);

        if (!query) {
            setData(dupData);
            return;
        }

        const filtered = dupData.filter((college: any) =>
            college.name.toLowerCase().includes(query.toLowerCase()) ||
            college.location?.toLowerCase().includes(query.toLowerCase())
        );

        setData(filtered);
    };

    // ❌ Delete
    const handleDelete = async (id: number) => {
        if (!globalThis.confirm("Are you sure you want to delete this college?")) return;

        try {
            await deleteInternationalCollege(id);
            toast.success("College deleted");

            setData(data.filter((c) => c.id !== id));
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete college");
        }
    };

    return (
        <>
            <div className="mb-2 sm:max-w-sm">
                <input
                    type="text"
                    placeholder="Search college"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="admin-input"
                />
            </div>

            <div className="admin-table-wrap">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-2 text-black dark:bg-meta-4 dark:text-white">
                            <tr>
                                <th className="admin-table-th xl:pl-8">Index</th>
                                <th className="admin-table-th min-w-[220px] xl:pl-8">
                                    College Name
                                </th>
                                <th className="admin-table-th min-w-[200px]">
                                    Location
                                </th>
                                <th className="admin-table-th min-w-[120px]">
                                    Visible
                                </th>
                                <th className="admin-table-th">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-sm text-body">
                                        No colleges found
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((college: any, index: number) => (
                                    <tr
                                        key={college.id}
                                        className="hover:bg-gray-2/30 dark:hover:bg-meta-4/30"
                                    >
                                        <td className="admin-table-td pl-8">
                                            {(currentPage - 1) * rowsPerPage + index + 1}
                                        </td>

                                        <td className="admin-table-td pl-8">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {college.name}
                                            </h5>
                                            <p className="text-xs text-body">
                                                {college.slug}
                                            </p>
                                        </td>

                                        <td className="admin-table-td">
                                            {college.location}
                                        </td>

                                        <td className="admin-table-td">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${college.visible
                                                    ? "bg-success text-white"
                                                    : "bg-gray-400 text-white"
                                                    }`}
                                            >
                                                {college.visible ? "Yes" : "No"}
                                            </span>
                                        </td>

                                        <td className="admin-table-td">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        (globalThis.location.href = `/edit-international/${college.id}`)
                                                    }
                                                    className="admin-btn-outline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(college.id)}
                                                    className="rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                        <div className="text-sm text-body">
                            Page {currentPage} of {totalPages || 1}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="admin-btn-outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .slice(Math.max(0, currentPage - 3), currentPage + 2)
                                .map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded ${currentPage === page ? "bg-primary text-white" : "bg-gray-2"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                            <button
                                className="admin-btn-outline"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                Next
                            </button>
                        </div>

                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="admin-input"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllInternationalColleges;