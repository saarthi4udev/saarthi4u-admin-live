import React, { useState, ChangeEvent } from 'react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  handleChange: (query: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  handleChange,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = () => {
    onSearch(searchQuery);
    setSearchQuery('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleChange(e.target.value);
  };

  // console.log(searchQuery);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-stroke bg-transparent px-3 text-body transition focus-within:border-primary dark:border-strokedark sm:max-w-sm">
        <span className="pointer-events-none shrink-0 text-body">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.33325 12.6667C10.2788 12.6667 12.6666 10.2789 12.6666 7.33337C12.6666 4.38785 10.2788 2 7.33325 2C4.38773 2 1.99992 4.38785 1.99992 7.33337C1.99992 10.2789 4.38773 12.6667 7.33325 12.6667Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13.3333 13.3334L11.3333 11.3334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          name="search"
          placeholder="Search by email"
          value={searchQuery}
          onChange={handleInputChange}
          className="h-full w-full bg-transparent text-sm text-black outline-none placeholder:text-body dark:text-white"
        />
      </div>

      <button onClick={handleSearch} className="admin-btn-outline h-11 sm:min-w-[96px]">
        {searchQuery.length > 0 ? 'Clear' : 'Search'}
      </button>
    </div>
  );
};

export default SearchFilter;
