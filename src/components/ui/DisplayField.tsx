import { LucideIcon } from 'lucide-react';

interface DisplayFieldProps {
  label: string;
  value: string;
  icon?: LucideIcon;
}

export default function DisplayField({ label, value, icon: Icon }: DisplayFieldProps) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1">
        {Icon && <Icon size={13} />}
        {label}
      </label>
      <div className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 font-medium">
        {value}
      </div>
    </div>
  );
}
