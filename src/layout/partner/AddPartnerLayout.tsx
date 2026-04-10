import { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import AddPartner from '../../components/partner/AddPartner';
import Breadcrumb from '../../components/Breadcrumb';

const AddPartnerLayout = () => {
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
                                pageName="Add Partner"
                            />
                            <AddPartner />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AddPartnerLayout;
