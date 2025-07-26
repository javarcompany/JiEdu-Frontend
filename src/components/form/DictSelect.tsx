import { useEffect, useState } from "react";

interface SearchableSelectProps {
  items: { label: string; value: string }[];
  placeholder?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  resetTrigger?: any;
}

export default function DictSearchableSelect({ items, placeholder = "Select...", onSelect, disabled = false, resetTrigger }: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setSearchTerm(""); // Clear input when resetTrigger changes
  }, [resetTrigger]);
  
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string, label: string) => {
    setSearchTerm(label);
    setShowDropdown(false);
    onSelect(value);
  };

  return (
    <div className="relative w-full">
        <input
            type="text"
            value={searchTerm}
            disabled={disabled}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(false)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder={placeholder}
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm 
                        shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  
                        dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/50 z-999
                        hover:border-brand-300 hover:shadow-xl dark:hover:border-brand-500
                        bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 
                        focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  
                        dark:focus:border-brand-800"
        />

        {showDropdown && (
            <ul className="absolute z-9999 w-full mt-1 bg-brand-200 overflow-auto scroll border border-gray-100 rounded-md shadow-lg max-h-40
                            dark:bg-gray-900 dark:text-white/90 dark:border-gray-800 text-gray-600 dark:text-white/90">
                {filteredItems.length > 0 ? (
                    filteredItems.map(({label, value}) => (
                    <li
                        key={value}
                        onClick={() => handleSelect(value, label)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 hover:rounded-md"
                    >
                        {label}
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
