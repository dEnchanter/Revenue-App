import { forwardRef, useEffect, useRef, useState } from "react";

export const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, toggleAllPageRowsSelected, onChange, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    function onChangeHandler(e) {
      toggleAllPageRowsSelected(false);
      onChange(e);
    }

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          onChange={onChangeHandler}
          ref={resolvedRef}
          {...rest}
        />
      </>
    );
  }
);

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';
