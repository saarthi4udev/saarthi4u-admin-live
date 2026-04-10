import { useEffect, useState } from "react";
import { getAllBlogs, deleteBlog } from "../../api/api";
import toast from "react-hot-toast";

const AllBlogs = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState<any[]>([]);
    const [dupData, setDupData] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadBlogs(page);
    }, [page]);

    const loadBlogs = async (pageNumber = page, query = search) => {
        try {
            const res = await getAllBlogs({
                page: pageNumber,
                limit,
                search: query,
                visible: true,
            });

            setData(res.data.data);
            setDupData(res.data.data);

            // assuming backend returns pagination info
            setTotalPages(res.data.totalPages || 1);
            setPage(pageNumber);

        } catch {
            toast.error("Failed to load blogs");
        }
    };
    const handleSearch = (query: string) => {
        setSearch(query);
        setPage(1); // reset page
        loadBlogs(1, query);
    };

    // ❌ Delete
    const handleDelete = async (id: number) => {
        if (!globalThis.confirm("Are you sure you want to delete this blog?"))
            return;

        try {
            await deleteBlog(id);
            toast.success("Blog deleted successfully");
            setData(data.filter((b) => b.id !== id));
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
                    placeholder="Search blog by title..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="admin-input"
                />
            </div>

            <div className="admin-table-wrap">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className=" bg-gray-2 text-black dark:bg-meta-4 dark:text-white">
                            <tr>
                                <th className="admin-table-th">#</th>
                                <th className="admin-table-th">Image</th>
                                <th className="admin-table-th">Title</th>
                                <th className="admin-table-th">Category</th>
                                <th className="admin-table-th">Featured</th>
                                <th className="admin-table-th">Visible</th>
                                <th className="admin-table-th">Published</th>
                                <th className="admin-table-th">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-sm">
                                        No Blogs Found
                                    </td>
                                </tr>
                            ) : (
                                data.map((blog: any, index: number) => (
                                    <tr key={blog.id} className="hover:bg-gray-100">

                                        {/* Index */}
                                        <td className="admin-table-td">
                                            {index + 1}
                                        </td>

                                        {/* Image */}
                                        <td className="admin-table-td">
                                            {blog.featuredImage ? (
                                                <img
                                                    src={blog.featuredImage}
                                                    alt={blog.title}
                                                    className="h-12 w-16 rounded object-cover"
                                                />
                                            ) : (
                                                "—"
                                            )}
                                        </td>

                                        {/* Title */}
                                        <td className="admin-table-td font-medium">
                                            {blog.title}
                                        </td>

                                        {/* Category */}
                                        <td className="admin-table-td">
                                            {blog.Category?.name || "—"}
                                        </td>

                                        {/* Featured */}
                                        <td className="admin-table-td">
                                            {blog.isFeatured ? (
                                                <span className="text-green-600 font-semibold">
                                                    Yes
                                                </span>
                                            ) : (
                                                "No"
                                            )}
                                        </td>

                                        {/* Visible */}
                                        <td className="admin-table-td">
                                            {blog.visible ? (
                                                <span className="text-blue-600 font-semibold">
                                                    Visible
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    Hidden
                                                </span>
                                            )}
                                        </td>

                                        {/* Published */}
                                        <td className="admin-table-td">
                                            {blog.publishedAt
                                                ? new Date(blog.publishedAt).toLocaleDateString()
                                                : "Draft"}
                                        </td>

                                        {/* Actions */}
                                        <td className="admin-table-td">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() =>
                                                        (globalThis.location.href = `/edit-blog/${blog.slug}`)
                                                    }
                                                    className="admin-btn-outline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="rounded-xl bg-danger px-4 py-2 text-white hover:opacity-90"
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

export default AllBlogs;