import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllEducationalPartners, deleteEducationalPartner } from "../../api/api";

const AllPartners = () => {

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadPartners(page);
    }, [page]);
    const loadPartners = async (pageNumber = 1) => {
        try {
            const res = await getAllEducationalPartners(pageNumber, 10);

            const transformed = res.data.map((p: any) => ({
                id: p.id,
                partnerName: p.name,                     // ✅ mapping
                logo: p.image,                           // ✅ mapping
                description: p.description,
                supportServices: p.services,             // ✅ mapping
                partnerType: p.tag,                      // ✅ mapping
                verificationStatus: p.tag ? "Verified" : "Pending", // optional logic
                portalStatus: p.visible ? "Active" : "Inactive",    // ✅ mapping
                displayOrder: 0,                         // backend doesn’t send
            }));

            setData(transformed);
            setTotalPages(res.totalPages);

        } catch (err) {
            console.log(err);
            toast.error("Failed to load partners");
        }
    };

    const handleSearch = (query: string) => {
        setSearch(query);

        if (!query) {
            loadPartners(page);
            return;
        }

        const filtered = data.filter((p: any) =>
            p.partnerName?.toLowerCase().includes(query.toLowerCase()) ||
            p.partnerType?.toLowerCase().includes(query.toLowerCase())
        );

        setData(filtered);
    };
    const handleDelete = async (id: number) => {
        if (!globalThis.confirm("Are you sure you want to delete this partner?")) return;

        try {
            await deleteEducationalPartner(id);

            toast.success("Partner deleted");

            loadPartners(page); // reload

        } catch (err) {
            console.log(err);
            toast.error("Failed to delete partner");
        }
    };
    return (
        <>
            {/* Search */}
            <div className="mb-2 sm:max-w-sm">
                <input
                    type="text"
                    placeholder="Search partner"
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
                                <th className="admin-table-th min-w-[200px] xl:pl-8">Partner Name</th>
                                <th className="admin-table-th min-w-[140px]">Partner Type</th>
                                <th className="admin-table-th min-w-[120px]">Verification</th>
                                <th className="admin-table-th min-w-[100px]">Status</th>
                                <th className="admin-table-th min-w-[80px]">Order</th>
                                <th className="admin-table-th">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-black dark:text-white">
                                        No partners found. Click "Add Partner" to create one.
                                    </td>
                                </tr>
                            ) : (
                                data.map((partner: any, index: number) => (
                                    <tr key={partner.id} className="border-b border-stroke dark:border-strokedark">
                                        <td className="admin-table-td xl:pl-8">{index + 1}</td>
                                        <td className="admin-table-td xl:pl-8">
                                            <div className="flex items-center gap-3">
                                                {partner.logo && (
                                                    <img
                                                        src={partner.logo}
                                                        alt={partner.partnerName}
                                                        className="h-8 w-12 object-contain"
                                                    />
                                                )}
                                                <span className="font-medium text-black dark:text-white">
                                                    {partner.partnerName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="admin-table-td">{partner.partnerType}</td>
                                        <td className="admin-table-td">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${partner.verificationStatus === "Verified"
                                                ? "bg-success bg-opacity-10 text-success"
                                                : "bg-warning bg-opacity-10 text-warning"
                                                }`}>
                                                {partner.verificationStatus}
                                            </span>
                                        </td>
                                        <td className="admin-table-td">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${partner.portalStatus === "Active"
                                                ? "bg-success bg-opacity-10 text-success"
                                                : "bg-danger bg-opacity-10 text-danger"
                                                }`}>
                                                {partner.portalStatus}
                                            </span>
                                        </td>
                                        <td className="admin-table-td">{partner.displayOrder}</td>
                                        <td className="admin-table-td">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`/edit-partner/${partner.id}`}
                                                    className="inline-flex rounded bg-primary px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
                                                >
                                                    Edit
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(partner.id)}
                                                    className="inline-flex rounded bg-danger px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
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

                    <div className="flex justify-between items-center mt-4 text-black dark:text-white">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-sm">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllPartners;
