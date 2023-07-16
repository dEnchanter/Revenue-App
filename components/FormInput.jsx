import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export const FormInput = forwardRef(({ label, onChange, name, type }, ref) => {
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef();

  // Make external ref proxies to inputRef. Libraries like react-hook-form need this to work well
  // NOTE: We use create ref internally to be able to focus on input when any part of the
  // input container is clicked.
  useImperativeHandle(ref, () => inputRef.current);

  function handleFocus() {
    setHasFocus(true);
  }

  function handleBlur() {
    setHasFocus(false);
  }

  return (
    <div
      onClick={() => inputRef.current.focus()}
      className={`ring-1 ${
        hasFocus ? 'ring-gray-400 ring-opacity-50 bg-[#189FB8]/30 h-[3.5rem]' : 'ring-gray-200 ring-opacity-80 bg-[#189FB8]/30 h-[3.5rem]'
      } rounded px-2`}
    >
      <span className="w-full text-xs font-bold text-[#095D52] leading-1" htmlFor={name}>
        {label}
      </span>
      <input
        onChange={onChange}
        ref={inputRef}
        name={name}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full text-gray-700 focus:outline-none appearance-none ring-opacity-50 rounded text-sm bg-transparent pb-1"
        type={type}
      />
    </div>
  );
});

FormInput.displayName = 'FormInput';
