export default function AuthField({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-light-text dark:text-dark-text">
        {label}
      </span>

      <input
        {...props}
        className="block w-full rounded-md border border-dark-border/30 bg-light-card px-3 py-2 text-[13px] text-light-text placeholder:text-light-secondary/55 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text dark:placeholder:text-dark-text/45 dark:focus:border-dark-accent dark:focus:ring-dark-accent/25"
      />
    </label>
  );
}
