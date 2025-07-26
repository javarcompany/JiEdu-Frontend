import { useEffect, useState } from "react";

interface SearchableSelectProps {
  items: { label: string; value: string; image?: string }[];
  placeholder?: string;
  onSelect: (value: string | null) => void;
  disabled?: boolean;
  resetTrigger?: any;
}

export default function DictSearchableSelect_Avatar({
  items,
  placeholder = "Select...",
  onSelect,
  disabled = false,
  resetTrigger,
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    label: string;
    value: string;
    image?: string;
  } | null>(null);

  useEffect(() => {
    setSearchTerm("");
    setSelectedItem(null);
  }, [resetTrigger]);

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string, label: string, image?: string) => {
    setSelectedItem({ value, label, image });
    setShowDropdown(false);
    onSelect(value);
  };

  const handleClear = () => {
    setSelectedItem(null);
    setSearchTerm("");
    onSelect(null);
  };

  return (
    <div className="relative w-full">
      {selectedItem ? (
        <div className="flex items-center justify-between gap-3 mb-2 p-2 bg-gray-100 rounded-md dark:bg-gray-800">
          <div className="flex items-center gap-3">
            {selectedItem.image && (
              <img
                src={selectedItem.image}
                alt={selectedItem.label}
                className="h-8  object-cover"
              />
            )}
            <span className="text-sm font-medium">{selectedItem.label}</span>
          </div>
          <button
            onClick={handleClear}
            className="text-xl mr-3 font-bold text-gray-500 hover:text-red-500"
            aria-label="Clear selection"
          >
            ×
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={searchTerm}
            disabled={disabled}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
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
            <ul className="absolute z-9999 w-full mt-1 bg-white overflow-auto scroll border border-gray-100 rounded-md shadow-lg max-h-60
                           dark:bg-gray-900 dark:text-white/90 dark:border-gray-800 text-gray-600">
              {filteredItems.length > 0 ? (
                filteredItems.map(({ label, value, image }) => (
                  <li
                    key={value}
                    onClick={() => handleSelect(value, label, image)}
                    className="flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 hover:rounded-md"
                  >
                    {image && (
                      <img
                        src={image}
                        alt={label}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span>{label}</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No results found!</li>
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
