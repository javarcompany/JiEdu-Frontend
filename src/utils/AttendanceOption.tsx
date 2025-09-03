type RadioCircleOption = {
  value: string;
  label: string;
  selectedColor: string;
};

type Props = {
  name: string;
  options: RadioCircleOption[];
  selected: string;
  extClass: string;
  onChange: (value: string) => void;
};

export default function RadioCircleSelector({
  name,
  options,
  selected,
  extClass,
  onChange,
}: Props) {
  return (
    <div className="flex gap-4">
      {options.map((option) => (
        <label key={option.value} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
            className={`sr-only ${extClass}`}
          />
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all
              ${
                selected === option.value
                  ? `${option.selectedColor} text-white`
                  : "bg-white text-gray-800 border-gray-400"
              }
            `}
          >
            {option.label}
          </div>
        </label>
      ))}
    </div>
  );
}
