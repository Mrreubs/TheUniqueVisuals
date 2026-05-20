import { Link } from 'react-router-dom';

const variants = {
  gold: 'bg-gold hover:bg-gold-light text-white shadow-[0_4px_24px_rgba(201,168,76,0.3)]',
  outline: 'border border-white hover:border-gold hover:text-gold text-white backdrop-blur-sm',
  outlineDark: 'border border-gray-300 dark:border-white/20 hover:border-gold hover:text-gold text-gray-900 dark:text-white',
  ghost: 'text-gray-900 dark:text-white hover:text-gold',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

const sizes = {
  sm: 'px-4 py-2.5 text-xs',
  md: 'px-6 py-3.5 text-sm',
  lg: 'px-8 py-4 text-sm',
  xl: 'px-10 py-5 text-base',
};

export default function Button({ children, variant = 'gold', size = 'md', to, href, className = '', disabled, loading, onClick, type = 'button', ...props }) {
  const classes = `${variants[variant] || variants.gold} ${sizes[size] || sizes.md} font-bold uppercase tracking-widest rounded transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`;

  if (to) {
    return <Link to={to} className={classes} {...props}>{loading ? 'Loading...' : children}</Link>;
  }

  if (href) {
    return <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={classes} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}
