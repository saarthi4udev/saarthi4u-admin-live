import { useEffect, useState } from "react";
import { getAllNews, deleteNews } from "../../api/api";
import toast from "react-hot-toast";

const AllNews = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState<any[]>([]);
    const [dupData, setDupData] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadNews(page);
    }, [page]);

    const loadNews = async (pageNumber = 1) => {
        const res = await getAllNews(pageNumber, 10);

        setData(res.data.data);
        setDupData(res.data.data);

        setPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
    };
    const handleSearch = (query: string) => {
        setSearch(query);

        if (!query) {
            setData(dupData);
            return;
        }

        const filtered = dupData.filter((news: any) =>
            news.title.toLowerCase().includes(query.toLowerCase())
        );

        setData(filtered);
    };

    const handleDelete = async (id: string) => {
        if (!globalThis.confirm("Delete this news?")) return;

        await deleteNews(id);
        toast.success("News deleted");

        loadNews(page); // ✅ reload current page
    };

    return (
        <>
            <input
                type="text"
                placeholder="Search news"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="admin-input mb-4"
            />

            <div className="admin-table-wrap">
                <table className="w-full table-auto">
                    <thead className="bg-gray-2 text-black dark:bg-meta-4 dark:text-white">
                        <tr>
                            <th className="admin-table-th">Index</th>
                            <th className="admin-table-th">Title</th>
                            <th className="admin-table-th">Category</th>
                            <th className="admin-table-th">Breaking</th>
                            <th className="admin-table-th">Visible</th>
                            <th className="admin-table-th">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6">
                                    No news found
                                </td>
                            </tr>
                        ) : (
                            data.map((news: any, index: number) => (
                                <tr key={news.id}>
                                    <td className="admin-table-td">
                                        {index + 1}
                                    </td>

                                    <td className="admin-table-td">
                                        {news.title}
                                    </td>

                                    <td className="admin-table-td">
                                        {news.category?.name || "—"}
                                    </td>

                                    <td className="admin-table-td">
                                        {news.isBreaking ? "🔥 Yes" : "No"}
                                    </td>

                                    <td className="admin-table-td">
                                        {news.visible ? "Yes" : "No"}
                                    </td>

                                    <td className="admin-table-td">
                                        <button
                                            onClick={() =>
                                                (globalThis.location.href = `/edit-news/${news.id}`)
                                            }
                                            className="admin-btn-outline"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(news.id)}
                                            className="bg-danger text-white px-4 py-2 rounded-xl ml-2"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="flex justify-center items-center gap-4 mt-6">

                    {/* PREVIOUS */}
                    <button
                        onClick={() => setPage((prev) => prev - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    {/* PAGE NUMBERS */}
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-500 text-white" : ""
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    {/* NEXT */}
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>

                </div>
            </div>
        </>
    );
};

export default AllNews;