import { useState } from "react";

interface SearchableSelectProps {
  items: string[];
  placeholder?: string;
  onSelect: (value: string) => void;
}

export default function SearchableSelect({ items, placeholder = "Select...", onSelect }: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (item: string) => {
    setSearchTerm(item);
    setShowDropdown(false);
    onSelect(item);
  };

  return (
    <div className="relative w-full">
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(false)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder={placeholder}
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm 
                        shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  
                        dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/50

                        bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 
                        focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  
                        dark:focus:border-brand-800"
        />

        {showDropdown && (
            <ul className="absolute z-10 z-[9999] w-full mt-1 bg-transparent border border-gray-100 rounded-md shadow-lg max-h-40
                            dark:bg-gray-900 dark:text-white/90 dark:border-gray-800 text-gray-600 dark:text-white/90">
                {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                    <li
                    key={idx}
                    onClick={() => handleSelect(item)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 hover:rounded-md"
                    >
                    {item}
                    </li>
                ))
                ) : (
                    <li className="px-4 py-2 text-gray-500">No results found!</li>
                )}
            </ul>
        )}
    </div>
  );
}