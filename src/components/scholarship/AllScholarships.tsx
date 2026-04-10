import { useEffect, useState } from "react";
import { getAllScholarships, deleteScholarship } from "../../api/api";
import toast from "react-hot-toast";

const AllScholarships = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState<any[]>([]);
    const [dupData, setDupData] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadScholarships(page, search);
    }, [page, search]);

    const loadScholarships = async (pageNumber = page, query = search) => {
        try {
            const res = await getAllScholarships({
                page: pageNumber,
                limit,
                search: query,
            });

            setData(res.data.data);

            // backend should return this
            setTotalPages(res.data.totalPages || 1);

        } catch (err) {
            console.log(err);
            toast.error("Failed to load scholarships");
        }
    };

    // 🔍 Search filter
    const handleSearch = (query: string) => {
        setSearch(query);

        if (!query) {
            setData(dupData);
            return;
        }

        const filtered = dupData.filter((sch: any) =>
            sch.name?.toLowerCase().includes(query.toLowerCase()) ||
            sch.shortName?.toLowerCase().includes(query.toLowerCase()) ||
            sch.provider?.toLowerCase().includes(query.toLowerCase())
        );

        setData(filtered);
    };

    // ❌ Delete scholarship
    const handleDelete = async (id: number) => {
        if (!globalThis.confirm("Are you sure you want to delete this scholarship?")) return;

        try {
            await deleteScholarship(id);
            toast.success("Scholarship deleted");

            setData(data.filter((s) => s.id !== id));
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete scholarship");
        }
    };

    return (
        <>
            {/* Search */}
            <div className="mb-2 sm:max-w-sm">
                <input
                    type="text"
                    placeholder="Search scholarship"
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
                                <th className="admin-table-th xl:pl-8">Index</th>
                                <th className="admin-table-th min-w-[220px] xl:pl-8">
                                    Scholarship Name
                                </th>
                                <th className="admin-table-th min-w-[160px]">
                                    Provider
                                </th>
                                <th className="admin-table-th min-w-[120px]">
                                    Level
                                </th>
                                <th className="admin-table-th min-w-[140px]">
                                    Type
                                </th>
                                <th className="admin-table-th min-w-[140px]">
                                    Amount
                                </th>
                                <th className="admin-table-th min-w-[100px]">
                                    Visible
                                </th>
                                <th className="admin-table-th">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-8 text-center text-sm text-body">
                                        No scholarships found
                                    </td>
                                </tr>
                            ) : (
                                data.map((sch: any, index: number) => (
                                    <tr
                                        className="hover:bg-gray-2/30 dark:hover:bg-meta-4/30"
                                        key={sch.id}
                                    >
                                        <td className="admin-table-td pl-8">
                                            {(page - 1) * limit + index + 1}
                                        </td>

                                        <td className="admin-table-td pl-8">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {sch.name}
                                            </h5>
                                        </td>

                                        <td className="admin-table-td">
                                            {sch.provider || "—"}
                                        </td>

                                        <td className="admin-table-td">
                                            {sch.level || "—"}
                                        </td>

                                        <td className="admin-table-td">
                                            {sch.scholarshipType || "—"}
                                        </td>

                                        <td className="admin-table-td">
                                            {sch.amount || "—"}
                                        </td>

                                        <td className="admin-table-td">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${sch.visible
                                                    ? "bg-success text-white"
                                                    : "bg-gray-400 text-white"
                                                    }`}
                                            >
                                                {sch.visible ? "Yes" : "No"}
                                            </span>
                                        </td>

                                        <td className="admin-table-td">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        (globalThis.location.href = `/edit-scholarship/${sch.id}`)
                                                    }
                                                    className="admin-btn-outline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(sch.id)}
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
                    <div className="flex justify-center items-center gap-4 mt-4">

                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="admin-btn-outline disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="text-sm">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="admin-btn-outline disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>
                </div>
            </div>
        </>
    );
};

export default AllScholarships;