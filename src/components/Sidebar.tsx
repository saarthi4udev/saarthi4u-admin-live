import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../images/Logo.png';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const baseNavItemClass =
  'admin-nav-item group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200';
const activeNavItemClass = 'admin-nav-active';

const subItemClass =
  'admin-sub-item block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200';

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { pathname } = useLocation();
  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLElement | null>(null);

  const [usersOpen, setUsersOpen] = useState(pathname.startsWith('/users') || pathname.startsWith('/admin'));
  const [categoriesOpen, setCategoriesOpen] = useState(
    pathname.startsWith('/categories') || pathname.startsWith('/add-category') || pathname.startsWith('/edit-category'),
  );

  const [blogsOpen, setBlogsOpen] = useState(
    pathname.startsWith('/blogs') || pathname.startsWith('/add-blog') || pathname.startsWith('/edit-blog'),
  );

  const [examsOpen, setExamsOpen] = useState(
    pathname.startsWith('/exams') || pathname.startsWith('/add-exam') || pathname.startsWith('/edit-exam'),
  );

  const [newsOpen, setNewsOpen] = useState(
    pathname.startsWith('/news') || pathname.startsWith('/add-new') || pathname.startsWith('/edit-new'),
  );

  const [scholarshipsOpen, setScholarshipsOpen] = useState(
    pathname.startsWith('/scholarships') || pathname.startsWith('/add-scholarship') || pathname.startsWith('/edit-scholarship'),
  );

  const [internationalOpen, setInternationalOpen] = useState(
    pathname.startsWith('/international-colleges') || pathname.startsWith('/add-international') || pathname.startsWith('/edit-international'),
  );

  const [professorsOpen, setProfessorsOpen] = useState(
    pathname.startsWith('/professors') || pathname.startsWith('/add-professor') || pathname.startsWith('/edit-professor'),
  );

  const [partnersOpen, setPartnersOpen] = useState(
    pathname.startsWith('/partners') || pathname.startsWith('/add-partner') || pathname.startsWith('/edit-partner'),
  );

  const [testimonialsOpen, setTestimonialsOpen] = useState(
    pathname.startsWith('/testimonials') || pathname.startsWith('/add-testimonial') || pathname.startsWith('/edit-testimonial'),
  );


  useEffect(() => {
    if (pathname.startsWith('/users') || pathname.startsWith('/admin')) {
      setUsersOpen(true);
    }

    if (pathname.startsWith('/categories') || pathname.startsWith('/add-category') || pathname.startsWith('/edit-category')) {
      setCategoriesOpen(true);
    }

    if (
      pathname.startsWith('/blogs') || pathname.startsWith('/add-blog') || pathname.startsWith('/edit-blog')
    ) {
      setBlogsOpen(true);
    }

    if (
      pathname.startsWith('/exams') || pathname.startsWith('/add-exam') || pathname.startsWith('/edit-exam')
    ) {
      setExamsOpen(true);
    }

    if (
      pathname.startsWith('/news') || pathname.startsWith('/add-new') || pathname.startsWith('/edit-new')
    ) {
      setNewsOpen(true);
    }

    if (pathname.startsWith('/scholarships') || pathname.startsWith('/add-scholarship') || pathname.startsWith('/edit-scholarship')) {
      setScholarshipsOpen(true);
    }

    if (
      pathname.startsWith('/international-colleges') || pathname.startsWith('/add-international') || pathname.startsWith('/edit-international')
    ) {
      setInternationalOpen(true);
    }

    if (
      pathname.startsWith('/professors') || pathname.startsWith('/add-professor') || pathname.startsWith('/edit-professor')
    ) {
      setProfessorsOpen(true);
    }

    if (
      pathname.startsWith('/partners') || pathname.startsWith('/add-partner') || pathname.startsWith('/edit-partner')
    ) {
      setPartnersOpen(true);
    }

    if (
      pathname.startsWith('/testimonials') || pathname.startsWith('/add-testimonial') || pathname.startsWith('/edit-testimonial')
    ) {
      setTestimonialsOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;

      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      ) {
        return;
      }

      setSidebarOpen(false);
    };

    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== 'Escape') return;
      setSidebarOpen(false);
    };

    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <div
        className={`admin-sidebar-overlay fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        ref={sidebar}
        className={`admin-sidebar admin-fade-in fixed left-0 top-0 z-50 flex h-screen w-72 flex-col transition-transform duration-300 ease-out lg:static lg:z-30 lg:h-auto lg:min-h-full lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between border-b border-current/10 px-5 py-4">
          <NavLink to="/dashboard" onClick={closeOnMobile} className="block">
            <img src={Logo} alt="Saarthi4u" className="h-11 w-auto rounded-md bg-[#F0FDFA] p-1" />
          </NavLink>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-current transition hover:bg-current/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-5">
          <p className="admin-menu-label mb-3 px-3 text-xs font-semibold uppercase tracking-[0.2em]">Menu</p>

          <ul className="space-y-1.5">
            <li>
              <NavLink
                exact
                to="/dashboard"
                onClick={closeOnMobile}
                className={baseNavItemClass}
                activeClassName={activeNavItemClass}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.25 9.75L9 3L15.75 9.75V15C15.75 15.4142 15.4142 15.75 15 15.75H3C2.58579 15.75 2.25 15.4142 2.25 15V9.75Z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink exact to="/contact-us" onClick={closeOnMobile} className={baseNavItemClass} activeClassName={activeNavItemClass}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.25 4.5C2.25 3.87868 2.75368 3.375 3.375 3.375H14.625C15.2463 3.375 15.75 3.87868 15.75 4.5V13.5C15.75 14.1213 15.2463 14.625 14.625 14.625H3.375C2.75368 14.625 2.25 14.1213 2.25 13.5V4.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 5.25L9 9.375L15 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Contact Us
              </NavLink>
            </li>

            <li>
              <NavLink exact to="/online" onClick={closeOnMobile} className={baseNavItemClass} activeClassName={activeNavItemClass}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.25 4.5C2.25 3.87868 2.75368 3.375 3.375 3.375H14.625C15.2463 3.375 15.75 3.87868 15.75 4.5V13.5C15.75 14.1213 15.2463 14.625 14.625 14.625H3.375C2.75368 14.625 2.25 14.1213 2.25 13.5V4.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 5.25L9 9.375L15 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Online Consultation Data
              </NavLink>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setUsersOpen((prev) => !prev)}
                className={`${baseNavItemClass} w-full justify-between ${pathname.startsWith('/users') || pathname.startsWith('/admin') ? activeNavItemClass : ''
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9Z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3.75 14.25C3.75 11.9728 6.10051 10.125 9 10.125C11.8995 10.125 14.25 11.9728 14.25 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  Users
                </span>
                <svg
                  className={`transition-transform duration-200 ${usersOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${usersOpen ? 'max-h-36 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-12">
                  <NavLink exact to="/users" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    All Users
                  </NavLink>
                  <NavLink exact to="/admin" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    Admin Users
                  </NavLink>
                </div>
              </div>
            </li>

            <li>
              <NavLink exact to="/add-admin" onClick={closeOnMobile} className={baseNavItemClass} activeClassName={activeNavItemClass}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 4.125V13.875M4.125 9H13.875" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
                Add Admin
              </NavLink>
            </li>

            <li>
              <NavLink exact to="/college" onClick={closeOnMobile} className={baseNavItemClass} activeClassName={activeNavItemClass}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 15H15M4.5 15V6.75M9 15V6.75M13.5 15V6.75M2.25 6.75L9 3L15.75 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Manage Colleges
              </NavLink>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setCategoriesOpen((prev) => !prev)}
                className={`${baseNavItemClass} w-full justify-between ${pathname.startsWith('/categories') || pathname.startsWith('/add-category') || pathname.startsWith('/edit-category')
                  ? activeNavItemClass
                  : ''
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3H8V8H3V3ZM10 3H15V8H10V3ZM3 10H8V15H3V10ZM10 10H15V15H10V10Z" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                  Categories
                </span>
                <svg
                  className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${categoriesOpen ? 'max-h-36 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-12">
                  <NavLink exact to="/add-category" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    Add Category
                  </NavLink>
                  <NavLink exact to="/categories" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    View Categories
                  </NavLink>
                </div>
              </div>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setBlogsOpen((prev) => !prev)}
                className={`${baseNavItemClass} w-full justify-between ${pathname.startsWith('/blogs') || pathname.startsWith('/add-blog') || pathname.startsWith('/edit-blog')
                  ? activeNavItemClass
                  : ''
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3H8V8H3V3ZM10 3H15V8H10V3ZM3 10H8V15H3V10ZM10 10H15V15H10V10Z" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                  Blogs
                </span>
                <svg
                  className={`transition-transform duration-200 ${blogsOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${blogsOpen ? 'max-h-36 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-12">
                  <NavLink exact to="/add-blog" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    Add Blog
                  </NavLink>
                  <NavLink exact to="/blogs" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    View Blogs
                  </NavLink>
                </div>
              </div>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setExamsOpen((prev) => !prev)}
                className={`${baseNavItemClass} w-full justify-between ${pathname.startsWith('/exams') || pathname.startsWith('/add-exam') || pathname.startsWith('/edit-exam')
                  ? activeNavItemClass
                  : ''
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3H8V8H3V3ZM10 3H15V8H10V3ZM3 10H8V15H3V10ZM10 10H15V15H10V10Z" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                  Exams
                </span>
                <svg
                  className={`transition-transform duration-200 ${examsOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${examsOpen ? 'max-h-36 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-12">
                  <NavLink exact to="/add-exam" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    Add Exam
                  </NavLink>
                  <NavLink exact to="/exams" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    View Exams
                  </NavLink>
                </div>
              </div>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setScholarshipsOpen((prev) => !prev)}
                className={`${baseNavItemClass} w-full justify-between ${pathname.startsWith('/scholarships') || pathname.startsWith('/add-scholarship') || pathname.startsWith('/edit-scholarship')
                  ? activeNavItemClass
                  : ''
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3H8V8H3V3ZM10 3H15V8H10V3ZM3 10H8V15H3V10ZM10 10H15V15H10V10Z" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                  Scholarships
                </span>
                <svg
                  className={`transition-transform duration-200 ${scholarshipsOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${scholarshipsOpen ? 'max-h-36 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-12">
                  <NavLink exact to="/add-scholarship" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    Add Scholarship
                  </NavLink>
                  <NavLink exact to="/scholarships" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    View Scholarships
                  </NavLink>
                </div>
              </div>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setNewsOpen((prev) => !prev)}
                className={`${baseNavItemClass} w-full justify-between ${pathname.startsWith('/news') || pathname.startsWith('/add-news') || pathname.startsWith('/edit-news')
                  ? activeNavItemClass
                  : ''
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3H8V8H3V3ZM10 3H15V8H10V3ZM3 10H8V15H3V10ZM10 10H15V15H10V10Z" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                  News
                </span>
                <svg
                  className={`transition-transform duration-200 ${newsOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${newsOpen ? 'max-h-36 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-12">
                  <NavLink exact to="/add-news" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    Add News
                  </NavLink>
                  <NavLink exact to="/news" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    View News
                  </NavLink>
                </div>
              </div>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setInternationalOpen((prev) => !prev)}
                className={`${baseNavItemClass} w-full justify-between ${pathname.startsWith('/international-colleges') || pathname.startsWith('/add-international') || pathname.startsWith('/edit-international')
                  ? activeNavItemClass
                  : ''
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3H8V8H3V3ZM10 3H15V8H10V3ZM3 10H8V15H3V10ZM10 10H15V15H10V10Z" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                  International Colleges
                </span>
                <svg
                  className={`transition-transform duration-200 ${internationalOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${internationalOpen ? 'max-h-36 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-12">
                  <NavLink exact to="/add-international" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    Add International College
                  </NavLink>
                  <NavLink exact to="/international-colleges" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    View International Colleges
                  </NavLink>
                </div>
              </div>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setProfessorsOpen((prev) => !prev)}
                className={`${baseNavItemClass} w-full justify-between ${pathname.startsWith('/professors') || pathname.startsWith('/add-professor') || pathname.startsWith('/edit-professor')
                  ? activeNavItemClass
                  : ''
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 2a4 4 0 1 1 0 8A4 4 0 0 1 9 2zm0 10c4 0 7 1.79 7 4v1H2v-1c0-2.21 3-4 7-4z" fill="currentColor" />
                    </svg>
                  </span>
                  Professors
                </span>
                <svg
                  className={`transition-transform duration-200 ${professorsOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${professorsOpen ? 'max-h-36 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-12">
                  <NavLink exact to="/add-professor" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    Add Professor
                  </NavLink>
                  <NavLink exact to="/professors" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    View Professors
                  </NavLink>
                </div>
              </div>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setPartnersOpen((prev) => !prev)}
                className={`${baseNavItemClass} w-full justify-between ${pathname.startsWith('/partners') || pathname.startsWith('/add-partner') || pathname.startsWith('/edit-partner')
                  ? activeNavItemClass
                  : ''
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 13c0-2.21 3.58-4 8-4s8 1.79 8 4v1H2v-1zm8-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="currentColor" opacity=".4" />
                      <path d="M14.5 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1c-1.5 0-2.84.5-3.86 1.32C11.57 9.11 12.74 9 14 9c2.48 0 4.56.88 5.8 2.18A3.98 3.98 0 0 0 20 10c0-1.1-2.46-2-5.5-2z" fill="currentColor" />
                    </svg>
                  </span>
                  Educational Partners
                </span>
                <svg
                  className={`transition-transform duration-200 ${partnersOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${partnersOpen ? 'max-h-36 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-12">
                  <NavLink exact to="/add-partner" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    Add Partner
                  </NavLink>
                  <NavLink exact to="/partners" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    View Partners
                  </NavLink>
                </div>
              </div>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setTestimonialsOpen((prev) => !prev)}
                className={`${baseNavItemClass} w-full justify-between ${pathname.startsWith('/testimonials') || pathname.startsWith('/add-testimonial') || pathname.startsWith('/edit-testimonial')
                  ? activeNavItemClass
                  : ''
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 8.25h9m-9 3H12m-8.25-5.25A2.25 2.25 0 0 1 6 3.75h12a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25H9l-4.5 4.5V6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Testimonials
                </span>
                <svg
                  className={`transition-transform duration-200 ${testimonialsOpen ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${testimonialsOpen ? 'max-h-36 mt-2' : 'max-h-0'}`}>
                <div className="space-y-1 pl-12">
                  <NavLink exact to="/add-testimonial" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    Add Testimonial
                  </NavLink>
                  <NavLink exact to="/testimonials" onClick={closeOnMobile} className={subItemClass} activeClassName="bg-white/12 text-white">
                    View Testimonials
                  </NavLink>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
