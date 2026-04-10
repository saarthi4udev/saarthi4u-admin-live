import { useState } from "react";

export default function AdmissionList({ admissions, handleDelete }: any) {
    const [search, setSearch] = useState("");

    const filteredAdmissions = admissions.filter((c: any) =>
        c.eligibility.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="rounded-sm border border-stroke bg-white dark:bg-boxdark dark:border-strokedark shadow-default p-5">

            {/* 🔍 Search */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                    Existing Admissions
                </h3>

                <input
                    type="text"
                    placeholder="Search admissions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 dark:border-strokedark rounded-lg px-3 py-2 text-sm bg-white dark:bg-boxdark text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* 📋 Table */}
            {filteredAdmissions.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No admissions found.
                </div>
            ) : (
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Index</th>
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Process</th>
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Eligibility</th>
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Entrance Exam</th>
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Application End</th>
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAdmissions.map((admission: any, index: number) => (
                                <tr
                                    key={admission.id}
                                    className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition"
                                >
                                    <td className="py-3 px-4 text-black dark:text-white">{index + 1}</td>
                                    <td className="py-3 px-4 text-black dark:text-white">{admission.process || "No Data"}</td>
                                    <td className="py-3 px-4 text-black dark:text-white">{admission.eligibility || "No Data"}</td>
                                    <td className="py-3 px-4 text-black dark:text-white">{admission.entranceExams || "No Data"}</td>
                                    <td className="py-3 px-4">{admission.importantDates?.applicationEnd || "No Data"}</td>


                                    {/* Actions */}
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(admission.id)}
                                                className="px-3 py-1.5 text-sm font-medium rounded-lg
                                   bg-danger text-white hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}