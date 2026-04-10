import React, { useState } from "react";
import AddCollege from "./AddCollege";
import AllColleges from "./AllCollege";
import CollegeMeta from "./CollegeMetaTabs";

const CollegeTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  const tabBase =
    "rounded-full px-4 py-2 text-sm font-medium transition";
  const activeStyle = "bg-primary text-white";
  const inactiveStyle =
    "bg-transparent text-body hover:bg-gray-2 dark:text-bodydark dark:hover:bg-meta-4";

  return (
    <div className="admin-section-card">
      <div>
        <h2 className="admin-section-title">Manage Colleges</h2>
        <p className="mt-1 text-sm text-body">Add colleges, update details, and manage metadata in one workflow.</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 rounded-2xl border border-stroke bg-white p-2 dark:border-strokedark dark:bg-boxdark-2">
        <button
          className={`${tabBase} ${activeTab === "list" ? activeStyle : inactiveStyle
            }`}
          onClick={() => setActiveTab("list")}
        >
          All Colleges
        </button>

        <button
          className={`${tabBase} ${activeTab === "add" ? activeStyle : inactiveStyle
            }`}
          onClick={() => setActiveTab("add")}
        >
          Add College
        </button>

        {selectedCollege && (
          <button
            className={`${tabBase} ${activeTab === "meta" ? activeStyle : inactiveStyle
              }`}
            onClick={() => setActiveTab("meta")}
          >
            Manage Meta Data for: {selectedCollege.name}
          </button>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark sm:p-5">
        {activeTab === "list" && (
          <AllColleges
            onSelect={(college: any) => {
              setSelectedCollege(college);
              setActiveTab("meta");
            }}
          />
        )}

        {activeTab === "add" && (
          <AddCollege
            onCreated={(college: any) => {
              setSelectedCollege(college);
              setActiveTab("meta");
            }}
          />
        )}

        {activeTab === "meta" && selectedCollege && (
          <CollegeMeta college={selectedCollege} />
        )}
      </div>
    </div>
  );
};

export default CollegeTabs;