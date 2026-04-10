import { useState } from "react";
import CoursesTab from "./tabs/CourseTab";
import UpdateCollegeTab from "./UpdateCollegeTab";
import AdmissionTab from "./tabs/AdmissionTab";
import CutoffTab from "./tabs/CutoffTab";
import FacilityTab from "./tabs/FacilityTab";
import FAQTab from "./tabs/FAQTab";
import FacultyTab from "./tabs/FacultyTab";
import GalleryTab from "./tabs/GalleryTab";
import PlacementTab from "./tabs/PlacementTab";
import RecruiterTab from "./tabs/RecruiterTab";
import ReviewTab from "./tabs/ReviewTab";

const CollegeMeta = ({ college }: any) => {
  const [tab, setTab] = useState("update");

  const tabs = [
    { key: "update", label: "Update" },
    { key: "courses", label: "Courses" },
    { key: "admissions", label: "Admissions" },
    { key: "cutoffs", label: "Cutoffs" },
    { key: "facilities", label: "Facilities" },
    { key: "faculty", label: "Faculty" },
    { key: "faq", label: "FAQs" },
    { key: "gallery", label: "Gallery" },
    { key: "placements", label: "Placements" },
    { key: "recruiters", label: "Recruiters" },
    { key: "reviews", label: "Reviews" },
  ];

  const tabBase =
    "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition";
  const activeStyle = "bg-primary text-white";
  const inactiveStyle =
    "text-body hover:bg-gray-2 dark:text-bodydark dark:hover:bg-meta-4";

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-white sm:text-xl">
        Manage Data For: <span className="text-primary">{college.name}</span>
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-stroke bg-white p-2 dark:border-strokedark dark:bg-boxdark-2">
        <div className="flex min-w-max gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`${tabBase} ${
                tab === t.key ? activeStyle : inactiveStyle
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-stroke bg-white p-4 shadow-default transition-all duration-300 dark:border-strokedark dark:bg-boxdark sm:p-5">
        {tab === "update" && <UpdateCollegeTab collegeId={college.id} />}
        {tab === "courses" && <CoursesTab collegeId={college.id} />}
        {tab === "admissions" && <AdmissionTab collegeId={college.id} />}
        {tab === "cutoffs" && <CutoffTab collegeId={college.id} />}
        {tab === "facilities" && <FacilityTab collegeId={college.id} />}
        {tab === "faculty" && <FacultyTab collegeId={college.id} />}
        {tab === "faq" && <FAQTab collegeId={college.id} />}
        {tab === "gallery" && <GalleryTab collegeId={college.id} />}
        {tab === "placements" && <PlacementTab collegeId={college.id} />}
        {tab === "recruiters" && <RecruiterTab collegeId={college.id} />}
        {tab === "reviews" && <ReviewTab collegeId={college.id} />}
      </div>
    </div>
  );
};

export default CollegeMeta;