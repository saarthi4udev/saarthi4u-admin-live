import { useEffect, useRef, useState } from 'react';
import UserOne from '../images/user/user-01.png';
import { useAuth } from '../context/AuthContext';
import { Link, useHistory, useLocation } from 'react-router-dom';

const DropdownUser = () => {
  let history = useHistory();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  const { logout, user } = useAuth();

  const email = user?.email || '';
  const displayName = email ? email.split('@')[0] : 'User';
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin';

  const logOutWeb = (e: React.FormEvent) => {
    e.preventDefault();
    logout();
    setDropdownOpen(false);
    history.push('/auth/signin');
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current?.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen((prev) => !prev)}
        aria-expanded={dropdownOpen}
        aria-label="Open user menu"
        className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-1.5 transition hover:border-[#171E4C]/20 hover:bg-[#EAFCF8] dark:hover:border-strokedark dark:hover:bg-meta-4"
        type="button"
      >
        <span className="hidden text-right md:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {displayName}
          </span>
          <span className="block text-xs capitalize">{roleLabel}</span>
        </span>

        <span className="h-10 w-10 overflow-hidden rounded-full border border-stroke dark:border-strokedark">
          <img src={UserOne} alt="User" className="h-full w-full object-cover" />
        </span>

        <svg
          className={`hidden fill-current sm:block ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </button>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-2 flex w-72 flex-col rounded-xl border border-[#171E4C]/15 bg-white p-2 shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <div className="rounded-lg border border-[#171E4C]/12 bg-[#F0FDFA]/70 p-3 dark:border-strokedark dark:bg-meta-4/50">
          <div className="flex items-center gap-3">
            <span className="h-11 w-11 overflow-hidden rounded-full border border-stroke dark:border-strokedark">
              <img src={UserOne} alt="User" className="h-full w-full object-cover" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-black dark:text-white">{displayName}</p>
              <p className="truncate text-xs text-body">{email}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="rounded-full bg-secondary/20 px-2.5 py-1 font-medium text-primary">{roleLabel}</span>
            {user?.id ? <span className="text-body">ID: {user.id}</span> : null}
          </div>
        </div>

        <div className="my-2 h-px bg-stroke dark:bg-strokedark" />

        <Link
          to="/dashboard"
          onClick={() => setDropdownOpen(false)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            location.pathname.startsWith('/dashboard')
              ? 'bg-secondary/20 text-primary'
              : 'text-black hover:bg-gray-2 dark:text-white dark:hover:bg-meta-4'
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/users"
          onClick={() => setDropdownOpen(false)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            location.pathname.startsWith('/users')
              ? 'bg-secondary/20 text-primary'
              : 'text-black hover:bg-gray-2 dark:text-white dark:hover:bg-meta-4'
          }`}
        >
          Users
        </Link>
        <Link
          to="/admin"
          onClick={() => setDropdownOpen(false)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            location.pathname.startsWith('/admin')
              ? 'bg-secondary/20 text-primary'
              : 'text-black hover:bg-gray-2 dark:text-white dark:hover:bg-meta-4'
          }`}
        >
          Admins
        </Link>

        <div className="my-2 h-px bg-stroke dark:bg-strokedark" />

        <button
          onClick={logOutWeb}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-black transition duration-200 hover:bg-[#EAFCF8] hover:text-primary dark:text-white dark:hover:bg-meta-4"
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
              fill=""
            />
            <path
              d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
              fill=""
            />
          </svg>
          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;
