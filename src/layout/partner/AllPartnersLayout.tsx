import { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import AllPartners from '../../components/partner/AllPartners';
import Breadcrumb from '../../components/Breadcrumb';

const AllPartnersLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-shell dark:text-bodydark">
            <div className="flex min-h-screen overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="admin-main-content relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main>
                        <div className="mx-auto w-full max-w-screen-2xl p-3 sm:p-4 md:p-6 2xl:p-8">
                            <Breadcrumb
                                pageName="Partners"
                            />
                            <AllPartners />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AllPartnersLayout;
