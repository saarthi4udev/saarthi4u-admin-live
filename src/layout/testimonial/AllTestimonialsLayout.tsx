import { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import AllTestimonials from '../../components/testimonial/AllTestimonials';
import Breadcrumb from '../../components/Breadcrumb';

const AllTestimonialsLayout = () => {
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
                                pageName="Testimonials"
                            />
                            <AllTestimonials />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AllTestimonialsLayout;
