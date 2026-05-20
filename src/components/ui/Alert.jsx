export default function Alert({ children, variant = 'error', className = '' }) {
  const variants = {
    error: 'bg-red-500/10 border-red-500/50 text-red-500',
    success: 'bg-green-500/10 border-green-500/50 text-green-500',
    info: 'bg-gold/10 border-gold/50 text-gold',
  };

  return (
    <div className={`${variants[variant] || variants.error} border p-4 rounded-xl text-sm text-center ${className}`}>
      {children}
    </div>
  );
}
