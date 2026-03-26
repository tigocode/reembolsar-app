import { LucideIcon } from 'lucide-react';

interface DisplayFieldProps {
  label: string;
  value: string;
  icon?: LucideIcon;
}

export default function DisplayField({ label, value, icon: Icon }: DisplayFieldProps) {
  return (
    <div className="mb-4 print:mb-1">
      <label className="flex items-center gap-1 text-xs print:text-[9px] font-semibold text-gray-500 mb-1 print:mb-0.5">
        {Icon && <Icon size={13} />}
        {label}
      </label>
      <div className="w-full px-3 py-2.5 print:px-2 print:py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm print:text-xs text-gray-800 font-medium">
        {value}
      </div>
    </div>
  );
}
