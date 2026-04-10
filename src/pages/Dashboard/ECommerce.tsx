import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardThree from '../../components/CardThree.tsx';
import CardTwo from '../../components/CardTwo.tsx';
import { Link } from 'react-router-dom';

const ECommerce = () => {
  return (
    <>
      <div className="admin-fade-up mb-5 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 sm:p-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">Business Snapshot</h2>
        <p className="mt-1 text-sm text-body">Track your key numbers and open the most common actions in one place.</p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-primary px-3 py-1 font-medium text-white">Owner View</span>
          <span className="rounded-full border border-stroke bg-white px-3 py-1 text-body dark:border-strokedark dark:bg-boxdark">Realtime counters</span>
          <span className="rounded-full border border-stroke bg-white px-3 py-1 text-body dark:border-strokedark dark:bg-boxdark">Quick operations</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>

      <div className="admin-fade-up mt-6 rounded-2xl border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black dark:text-white">Quick Actions</h3>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">Owner Shortcuts</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            to="/college"
            className="rounded-xl border border-stroke bg-gray-2/50 px-4 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 dark:border-strokedark dark:bg-boxdark-2 dark:text-white dark:hover:bg-meta-4"
          >
            Manage Colleges
          </Link>
          <Link
            to="/categories"
            className="rounded-xl border border-stroke bg-gray-2/50 px-4 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 dark:border-strokedark dark:bg-boxdark-2 dark:text-white dark:hover:bg-meta-4"
          >
            Manage Categories
          </Link>
          <Link
            to="/users"
            className="rounded-xl border border-stroke bg-gray-2/50 px-4 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 dark:border-strokedark dark:bg-boxdark-2 dark:text-white dark:hover:bg-meta-4"
          >
            View Users
          </Link>
        </div>
      </div>
    </>
  );
};

export default ECommerce;
