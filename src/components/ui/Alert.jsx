const VARIANTS = {
  error: 'bg-red-500/10 border-red-500/50 text-red-500',
  success: 'bg-green-500/10 border-green-500/50 text-green-500',
  info: 'bg-gold/10 border-gold/50 text-gold',
};

export default function Alert({ children, variant = 'error', className = '' }) {
  return (
    <div className={`${VARIANTS[variant] || VARIANTS.error} border p-4 rounded-xl text-sm text-center ${className}`}>
      {children}
    </div>
  );
}
