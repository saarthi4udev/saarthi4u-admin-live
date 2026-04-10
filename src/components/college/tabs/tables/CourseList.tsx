import { useState } from "react";

export default function CoursesList({ courses, handleDelete, setSelectedCourseId }: any) {
    const [search, setSearch] = useState("");

    const filteredCourses = courses.filter((c: any) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="rounded-sm border border-stroke bg-white dark:bg-boxdark dark:border-strokedark shadow-default p-5">

            {/* 🔍 Search */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                    Existing Courses
                </h3>

                <input
                    type="text"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 dark:border-strokedark rounded-lg px-3 py-2 text-sm bg-white dark:bg-boxdark text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* 📋 Table */}
            {filteredCourses.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No courses found.
                </div>
            ) : (
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Index</th>
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Name</th>
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Duration</th>
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Level</th>
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Seats</th>
                                <th className="py-3 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCourses.map((course: any, index: number) => (
                                <tr
                                    key={course.id}
                                    className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition"
                                >
                                    <td className="py-3 px-4 text-black dark:text-white">{index + 1}</td>
                                    <td className="py-3 px-4 text-black dark:text-white">{course.name || "No Data"}</td>
                                    <td className="py-3 px-4">{course.duration || "No Data"}</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                            {course.level || "No Data"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{course.totalSeats || "No Data"}</td>

                                    {/* Actions */}
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">

                                            {/* Add Fees */}
                                            <button
                                                onClick={() => setSelectedCourseId(course.id)}
                                                className="px-3 py-1.5 text-sm font-medium rounded-lg
                                   bg-primary text-white hover:bg-opacity-90 transition"
                                            >
                                                Add Fees
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(course.id)}
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