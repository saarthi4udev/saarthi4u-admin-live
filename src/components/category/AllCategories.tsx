import { useEffect, useState } from "react";
import { getAllCategories, deleteCategory } from "../../api/api";
import toast from "react-hot-toast";

const AllCategories = () => {
  const [data, setData] = useState<any[]>([]);
  const [dupData, setDupData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const loadCategories = async () => {
    const res = await getAllCategories();
    setData(res.data.data);
    setDupData(res.data.data);
  };

  // 🔍 Search filter
  const handleSearch = (query: string) => {
    setSearch(query);

    if (!query) {
      setData(dupData);
      return;
    }

    const filtered = dupData.filter((category: any) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    );

    setData(filtered);
  };

  // ❌ Delete category
  const handleDelete = async (id: number) => {
    if (!globalThis.confirm("Are you sure you want to delete this category?")) return;

    await deleteCategory(id);
    toast.success("Category deleted");

    setData(data.filter((c) => c.id !== id));
  };

  return (
    <>
      <div className="mb-2 sm:max-w-sm">
        <input
          type="text"
          placeholder="Search category"
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
                <th className="admin-table-th xl:pl-8">
                  Index
                </th>
                <th className="admin-table-th min-w-[220px] xl:pl-8">
                  Category Name
                </th>
                <th className="admin-table-th min-w-[160px]">
                  Category Description
                </th>
                <th className="admin-table-th">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-body">
                    No categories found
                  </td>
                </tr>
              ) : (
                paginatedData.map((category: any, index: number) => (

                  <tr className="hover:bg-gray-2/30 dark:hover:bg-meta-4/30" key={category.id}>
                    <td className="admin-table-td pl-8">
                      <h5 className="font-medium text-black dark:text-white">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </h5>
                    </td>

                    <td className="admin-table-td pl-8">
                      <h5 className="font-medium text-black dark:text-white">
                        {category.name}
                      </h5>
                    </td>

                    <td className="admin-table-td">
                      <span className="admin-tag">
                        {category.description || "—"}
                      </span>
                    </td>

                    <td className="admin-table-td">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => globalThis.location.href = `/edit-category/${category.id}`}
                          className="admin-btn-outline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(category.id)}
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

export default AllCategories;