export function Label({
  children,
  font = "text-xs",
  margin = "mb-1",
  className,
  required,
  htmlFor,
  ...rest
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`${font} text-gray-700 block ${margin} opacity-80`}
      {...rest}
    >
      <span>{children}</span>
      {required && (
        <span className="italic text-gray-500 text-sm ml-2">(Required)</span>
      )}
    </label>
  );
}