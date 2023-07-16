import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

export const TextInput = forwardRef(({ 
  label, 
  onChange, 
  name, 
  type, 
  width = "w-full",
  padding = "px-2 py-2",
  bg = "bg-gray-50",
  color = "text-gray-700",
  height = "h-auto",
  margin = "",
  register,
  ...rest
}, ref) => {
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef();

  useImperativeHandle(ref, () => inputRef.current);

  function handleFocus() {
    setHasFocus(true);
  }

  function handleBlur() {
    setHasFocus(false);
  }

  return (
    <input
      onChange={onChange}
      ref={inputRef}
      name={name}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`${width} ${padding} ${margin} ${bg} ${color} ${height} focus:outline-none appearance-none ring-1 ring-gray-300 ring-opacity-50 focus:ring-1 focus:ring-gray-400 focus:ring-opacity-80 rounded text-sm`}
      type={type}
    />
  );
});