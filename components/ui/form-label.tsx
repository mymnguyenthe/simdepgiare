interface FormLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
}

export function FormLabel({ htmlFor, children }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-medium uppercase tracking-widest text-text-secondary"
    >
      {children}
    </label>
  );
}
