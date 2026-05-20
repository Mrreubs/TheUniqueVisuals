export default function Input({ label, icon: Icon, error, className = '', ...props }) {
  const base = 'w-full bg-gray-100 dark:bg-black/20 border rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none transition-all';
  const border = error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 dark:border-white/10 focus:border-gold focus:ring-1 focus:ring-gold';

  const input = (
    <input className={`${base} ${border} ${Icon ? 'pl-12' : ''} ${className}`} {...props} />
  );

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}
        {props.type === 'textarea' ? (
          <textarea className={`${base} ${border} resize-none ${className}`} {...props} />
        ) : (
          input
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
