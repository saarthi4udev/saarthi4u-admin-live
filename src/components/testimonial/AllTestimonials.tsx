import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllTestimonials, deleteTestimonial } from "../../api/api"; // ✅ added

const STARS = [1, 2, 3, 4, 5];

const AllTestimonials = () => {
    const [data, setData] = useState<any[]>([]);
    const [dupData, setDupData] = useState<any[]>([]); // ✅ FIXED
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            const res = await getAllTestimonials();

            // ✅ adjust based on your backend response
            const list = res?.data?.data || res?.data || [];

            setData(list);
            setDupData(list);

        } catch (err) {
            console.log(err);
            toast.error("Failed to load testimonials");
        }
    };

    const handleSearch = (query: string) => {
        setSearch(query);

        if (!query) {
            setData(dupData);
            return;
        }

        const filtered = dupData.filter((t: any) =>
            t.name?.toLowerCase().includes(query.toLowerCase()) ||
            t.testimonialType?.toLowerCase().includes(query.toLowerCase()) ||
            t.city?.toLowerCase().includes(query.toLowerCase())
        );

        setData(filtered);
    };

    const handleDelete = async (id: number) => {
        if (!globalThis.confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            await deleteTestimonial(id.toString()); // ✅ API call

            toast.success("Testimonial deleted");

            // ✅ update UI instantly
            const updated = data.filter((t) => t.id !== id);
            setData(updated);
            setDupData(updated);

        } catch (err) {
            console.log(err);
            toast.error("Failed to delete testimonial");
        }
    };

    const statusColor = (status: string) => {
        if (status === "Active") return "inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700";
        if (status === "Pending") return "inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700";
        return "inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600";
    };

    return (
        <>
            {/* Search */}
            <div className="mb-2 sm:max-w-sm">
                <input
                    type="text"
                    placeholder="Search by name, type, or city"
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
                                <th className="admin-table-th xl:pl-8">#</th>
                                <th className="admin-table-th min-w-[200px] xl:pl-8">Name</th>
                                <th className="admin-table-th min-w-[100px]">City</th>
                                <th className="admin-table-th min-w-[110px]">Quote</th>
                                <th className="admin-table-th min-w-[110px]">Rating</th>
                                <th className="admin-table-th">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-10 text-center text-gray-500">
                                        No testimonials found. Click "Add Testimonial" to create one.
                                    </td>
                                </tr>
                            ) : (
                                data.map((t: any, index: number) => (
                                    <tr key={t.id} className="border-b border-stroke dark:border-strokedark">
                                        <td className="admin-table-td xl:pl-8">{index + 1}</td>

                                        <td className="admin-table-td xl:pl-8">
                                            <div className="flex items-center gap-3">
                                                {(t.avatarUrl || t.avatar) && (
                                                    <img
                                                        src={t.avatarUrl || t.avatar} // ✅ FIXED
                                                        alt={t.name}
                                                        className="h-9 w-9 rounded-full object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium text-black dark:text-white">{t.name}</p>
                                                    <p className="text-xs text-gray-400">{t.role}</p>
                                                </div>
                                            </div>
                                        </td>


                                        <td className="admin-table-td">{t.city}</td>
                                        <td className="admin-table-td">
                                            <span className={statusColor(t.quote)}>
                                                {t.quote}
                                            </span>
                                        </td>
                                        <td className="admin-table-td">
                                            <span className="text-yellow-500 text-base">
                                                {STARS.map((s) => (
                                                    <span key={s} style={{ opacity: s <= t.rating ? 1 : 0.25 }}>
                                                        ★
                                                    </span>
                                                ))}
                                            </span>
                                        </td>

                                        <td className="admin-table-td">
                                            <div className="flex items-center gap-3">

                                                <button
                                                    onClick={() => handleDelete(t.id)}
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
                </div>
            </div>
        </>
    );
};

export default AllTestimonials;