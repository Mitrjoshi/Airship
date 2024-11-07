export default function MainLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full mx-auto max-w-[1200px] ${className}`}>
      {children}
    </div>
  );
}
