export function TableWrapper({ children }) {
  return (
    <div className="p-2 bg-white shadow-sm border border-gray-200 rounded">
      {children}
    </div>
  );
}