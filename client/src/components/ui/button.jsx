export function Button({
  as: Tag = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    outline:
      "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50",
  };

  return (
    <Tag className={`${base} ${styles[variant] ?? styles.primary} ${className}`} {...props} />
  );
}

export default Button;
