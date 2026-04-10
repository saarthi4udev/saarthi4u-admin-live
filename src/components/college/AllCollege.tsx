import { useEffect, useState } from "react";
import { getAllColleges, deleteCollege } from "../../api/api";
import toast from "react-hot-toast";

const AllColleges = ({ onSelect }: any) => {

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [data, setData] = useState<any[]>([]);
  const [dupData, setDupData] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadColleges(page);
  }, [page]);

  const loadColleges = async (pageNumber: number) => {
    try {
      const res = await getAllColleges(pageNumber, limit);

      console.log("API RESPONSE:", res);

      // ✅ axios response
      const raw = res?.data?.data || res?.data || [];
      const total = res?.data?.pagination?.totalPages || 1;

      setTotalPages(total);

      // ✅ SAME normalization as your working code
      const normalized = raw.map((college: any) => ({
        ...college,
        category: college?.Category?.name || "",
        established: college?.establishedYear || null,
        location: [college?.city, college?.state].filter(Boolean).join(", "),
        description: college?.overview
          ? college.overview.replaceAll(/<[^>]*>?/gm, "")
          : "",
        logo: college?.logo || "",
        type: college?.type || "College",
      }));

      setData(normalized);
      setDupData(normalized);

    } catch (err) {
      console.log("Error fetching colleges:", err);
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
      college?.name?.toLowerCase().includes(query.toLowerCase())
    );

    setData(filtered);
  };

  // ❌ Delete college
  const handleDelete = async (id: number) => {
    if (!globalThis.confirm("Are you sure you want to delete this college?")) return;

    await deleteCollege(id);
    toast.success("College deleted");

    setData(data.filter((c) => c.id !== id));
  };

  return (
    <>
      {/* 🔍 Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search college..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-boxdark focus:outline-none "
        />
      </div>

      {/* 📋 Table */}
      <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-2 text-black dark:bg-meta-4 dark:text-white">
              <tr className="bg-bodydark2 dark:bg-meta-4 text-left ">
                {/* <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Index
                </th> */}
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  College Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Category
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6">
                    <p className="text-gray-500">No colleges found</p>
                  </td>
                </tr>
              ) : (
                data.map((college: any, index: number) => (

                  <tr className="border-b border-[#eee] dark:border-strokedark" key={college.id}>
                    {/* Index */}
                    {/* <td className="border-b py-5 px-4 pl-9 xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {index + 1}
                      </h5>
                    </td> */}

                    {/* Name */}
                    <td className="border-b py-5 px-4 pl-9 xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {college.name}
                      </h5>
                    </td>

                    {/* Category */}
                    <td className="border-b py-5 px-4">
                      <span className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-gray-2 text-black dark:bg-meta-4 dark:text-white">
                        {college.Category?.name || "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="border-b py-5 px-4">
                      <div className="flex items-center gap-3">
                        {/* Manage */}
                        <button
                          onClick={() => onSelect(college)}
                          className="px-3 py-1.5 text-sm font-medium rounded-full bg-meta-5 text-white hover:bg-primary transition"
                        >
                          Manage
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(college.id)}
                          className="px-3 py-1.5 text-sm font-medium rounded-full bg-danger text-white hover:bg-meta-7 transition"
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

      <div className="flex justify-between items-center mt-4 text-black dark:text-white">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default AllColleges;