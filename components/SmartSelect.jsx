import { forwardRef } from 'react';
import Select from 'react-select';

export const SmartSelect = forwardRef(({ placeholder, loading, options, onChange, ...rest }, ref) => {
  return (
    <Select
      ref={ref} 
      placeholder={placeholder}
      {...rest}
      options={options}
      isLoading={loading}
      onChange={onChange}
    />
  );
});

SmartSelect.displayName = 'SmartSelect';