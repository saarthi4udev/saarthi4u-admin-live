import { useEffect, useState } from "react";
import { getAllExams, deleteExam } from "../../api/api";
import toast from "react-hot-toast";

const AllExams = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // or 1 as per your API test
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState<any[]>([]);
    const [dupData, setDupData] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadExams(page);
    }, [page]);

    const loadExams = async (pageNumber = page, query = search) => {
    try {
        const res = await getAllExams({
            page: pageNumber,
            limit,
            search: query,
        });

        setData(res.data.data);
        setDupData(res.data.data);

        setTotalPages(res.data.totalPages || 1);

    } catch (err) {
        console.log(err);
        toast.error("Failed to load exams");
    }
};

    // 🔍 Search filter
    // const handleSearch = (query: string) => {
    //     setSearch(query);

    //     if (!query) {
    //         setData(dupData);
    //         return;
    //     }

    //     const filtered = dupData.filter((exam: any) =>
    //         exam.name.toLowerCase().includes(query.toLowerCase()) ||
    //         exam.shortName?.toLowerCase().includes(query.toLowerCase())
    //     );

    //     setData(filtered);
    // };


    const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1); // let useEffect handle API call
};

    // ❌ Delete exam
    const handleDelete = async (id: number) => {
        if (!globalThis.confirm("Are you sure you want to delete this exam?")) return;

        try {
            await deleteExam(id);
            toast.success("Exam deleted");

            setData(data.filter((e) => e.id !== id));
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete exam");
        }
    };

    return (
        <>
            <div className="mb-2 sm:max-w-sm">
                <input
                    type="text"
                    placeholder="Search exam"
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
                                    Exam Name
                                </th>
                                <th className="admin-table-th min-w-[160px]">
                                    Category
                                </th>
                                <th className="admin-table-th min-w-[120px]">
                                    Level
                                </th>
                                <th className="admin-table-th min-w-[120px]">
                                    Mode
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
                                    <td colSpan={7} className="py-8 text-center text-sm text-body">
                                        No exams found
                                    </td>
                                </tr>
                            ) : (
                                data.map((exam: any, index: number) => (
                                    <tr
                                        className="hover:bg-gray-2/30 dark:hover:bg-meta-4/30"
                                        key={exam.id}
                                    >
                                        <td className="admin-table-td pl-8">
                                            {(page - 1) * limit + index + 1}
                                        </td>

                                        <td className="admin-table-td pl-8">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {exam.name}
                                            </h5>
                                            <p className="text-xs text-body">
                                                {exam.shortName}
                                            </p>
                                        </td>

                                        <td className="admin-table-td">
                                            {exam.category?.name || "—"}
                                        </td>

                                        <td className="admin-table-td">
                                            {exam.level}
                                        </td>

                                        <td className="admin-table-td">
                                            {exam.examMode}
                                        </td>

                                        <td className="admin-table-td">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${exam.visible
                                                    ? "bg-success text-white"
                                                    : "bg-gray-400 text-white"
                                                    }`}
                                            >
                                                {exam.visible ? "Yes" : "No"}
                                            </span>
                                        </td>

                                        <td className="admin-table-td">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        (globalThis.location.href = `/edit-exam/${exam.id}`)
                                                    }
                                                    className="admin-btn-outline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(exam.id)}
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

export default AllExams;