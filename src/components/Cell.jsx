import React, {  useState } from 'react';

export default function Cell({ val, grayArea, onChange }) {
  const [colored, setColored] = useState('');
  const handleChange = (e) => {
    onChange(e);
    setColored('userinput');
  };

  return (
    <input
      type="number"
      min="1"
      max="9"
      value={val}
      onChange={handleChange}
      className={`${grayArea} ${colored}`}
      disabled={val !== '' && colored === ''}
    />
  );
}
