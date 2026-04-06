import { forwardRef } from 'react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-7 py-3',
  lg: 'text-lg px-8 py-4',
};

const Button = forwardRef(({ children, variant = 'primary', size = 'md', className = '', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`${variants[variant]} ${sizes[size]} font-semibold inline-flex items-center gap-2 ${className}`}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
