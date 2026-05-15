interface GridContainerProps {
  children: React.ReactNode;
}

export default function GridContainer({ children }: GridContainerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {children}
    </div>
  );
}
