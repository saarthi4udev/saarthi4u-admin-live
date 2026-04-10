import { useEffect, useState } from "react";
import { getAllCategories, deleteCategory } from "../../api/api";
import toast from "react-hot-toast";

const AllCategories = () => {
  const [data, setData] = useState<any[]>([]);
  const [dupData, setDupData] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

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
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-body">
                    No categories found
                  </td>
                </tr>
              ) : (
                data.map((category: any, index: number) => (

                  <tr className="hover:bg-gray-2/30 dark:hover:bg-meta-4/30" key={category.id}>
                    <td className="admin-table-td pl-8">
                      <h5 className="font-medium text-black dark:text-white">
                        {index + 1}
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
        </div>
      </div>
    </>
  );
};

export default AllCategories;