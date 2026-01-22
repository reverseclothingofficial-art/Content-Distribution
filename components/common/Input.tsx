import { InputProps } from "@/types/common";

export default function Input({
  name,
  label,
  type,
  onChange,
  value,
  className,
  placeholder,
}: InputProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <input
      id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}
