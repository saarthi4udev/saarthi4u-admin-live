import { Link } from 'react-router-dom';
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-semibold text-primary dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="inline-flex items-center gap-1 rounded-full border border-primary/15 bg-[#F0FDFA] px-3 py-1.5 text-sm dark:border-strokedark dark:bg-boxdark">
          <li>
            <Link to="/dashboard" className="text-primary/70 hover:text-primary text-black dark:text-white">
              Dashboard
            </Link>
          </li>
          <li className="text-black dark:text-white">/</li>
          <li className="font-medium text-black dark:text-white">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
