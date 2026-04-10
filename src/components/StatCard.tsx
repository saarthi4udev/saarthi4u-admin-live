import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  trend: string;
  trendUp?: boolean;
  icon: ReactNode;
  loading?: boolean;
}

const StatCard = ({ title, value, trend, trendUp = true, icon, loading = false }: StatCardProps) => {
  return (
    <article className="dashboard-card relative overflow-hidden rounded-2xl border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-meta-3" />
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 dark:bg-meta-4">{icon}</div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h4 className="text-3xl font-bold leading-none text-black dark:text-white">{loading ? '...' : value}</h4>
          <p className="mt-1 text-sm font-medium text-body">{title}</p>
        </div>

        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${trendUp ? 'text-meta-3' : 'text-meta-5'}`}>
          {trend}
          <svg
            className={trendUp ? 'fill-meta-3' : 'fill-meta-5'}
            width="10"
            height="11"
            viewBox="0 0 10 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {trendUp ? (
              <path d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z" fill="" />
            ) : (
              <path d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z" fill="" />
            )}
          </svg>
        </span>
      </div>
    </article>
  );
};

export default StatCard;