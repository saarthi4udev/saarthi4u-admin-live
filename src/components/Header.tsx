import { Link, useLocation } from 'react-router-dom';
import Logo from '../images/Logo.png';
import DarkModeSwitcher from './DarkModeSwitcher';
import DropdownUser from './DropdownUser';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { pathname } = useLocation();

  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard Overview';
    if (pathname.startsWith('/users')) return 'User Management';
    if (pathname.startsWith('/admin')) return 'Admin Management';
    if (pathname.startsWith('/college')) return 'College Management';
    if (pathname.startsWith('/categories') || pathname.startsWith('/add-category') || pathname.startsWith('/edit-category')) {
      return 'Category Management';
    }
    if (pathname.startsWith('/blogs') || pathname.startsWith('/add-blog') || pathname.startsWith('/edit-blog')) {
      return 'Blog Management';
    }
    if (pathname.startsWith('/exams') || pathname.startsWith('/add-exam') || pathname.startsWith('/edit-exam')) {
      return 'Exam Management';
    }
    if (pathname.startsWith('/news') || pathname.startsWith('/add-new') || pathname.startsWith('/edit-new')) {
      return 'News Management';
    }
    if (pathname.startsWith('/scholarships') || pathname.startsWith('/add-scholarship') || pathname.startsWith('/edit-scholarship')) {
      return 'Scholarship Management';
    }
    if (pathname.startsWith('/international-colleges') || pathname.startsWith('/add-international') || pathname.startsWith('/edit-international')) {
      return 'International Colleges';
    }
    if (pathname.startsWith('/professors') || pathname.startsWith('/add-professor') || pathname.startsWith('/edit-professor')) {
      return 'Professor Management';
    }
    if (pathname.startsWith('/partners') || pathname.startsWith('/add-partner') || pathname.startsWith('/edit-partner')) {
      return 'Educational Partners';
    }
    if (pathname.startsWith('/testimonials') || pathname.startsWith('/add-testimonial') || pathname.startsWith('/edit-testimonial')) {
      return 'Testimonials';
    }
    if (pathname.startsWith('/contact-us')) return 'Contact Requests';
    if (pathname.startsWith('/add-admin')) return 'Add Admin';
    return 'Admin Panel';
  };

  const getPageHint = () => {
    if (pathname.startsWith('/dashboard')) return 'Track performance, activity, and quick insights';
    if (pathname.startsWith('/contact-us')) return 'Respond to incoming inquiries quickly';
    if (pathname.startsWith('/users') || pathname.startsWith('/admin')) return 'Manage access, users, and permissions';
    return 'Simple control panel for daily operations';
  };

  return (
    <header className="sticky top-0 z-40 flex w-full border-b border-[#171E4C]/10 bg-[#F0FDFA]/95 backdrop-blur-sm dark:border-strokedark dark:bg-boxdark">
      <div className="flex w-full items-center justify-between gap-4 px-3 py-3 sm:px-4 md:px-6 2xl:px-10">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#171E4C]/20 bg-white text-[#171E4C] shadow-sm transition hover:border-[#30D8C9]/70 hover:bg-[#EAFCF8] dark:border-strokedark dark:bg-boxdark dark:text-white lg:hidden"
            aria-label="Open sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.75 6.25H16.25M3.75 10H16.25M3.75 13.75H16.25" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>

          <Link className="block flex-shrink-0 lg:hidden" to="/dashboard">
            <img className="h-9 w-auto" src={Logo} alt="Logo" />
          </Link>

          <div className="min-w-0 rounded-xl border border-[#171E4C]/10 bg-white/80 px-3 py-1.5 shadow-sm dark:bg-meta-4/50">
            <h1 className="truncate text-lg font-semibold text-[#171E4C] dark:text-white md:text-xl">{getPageTitle()}</h1>
            <p className="hidden text-xs text-[#171E4C]/65 sm:block">{getPageHint()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ul className="flex items-center gap-2">
            <DarkModeSwitcher />
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
