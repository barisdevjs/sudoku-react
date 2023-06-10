import React, {  useState } from 'react';

export default function Cell({ val, grayArea, onChange, conflict }) {
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
      name={val}
      value={val}
      onChange={handleChange}
      className={`${grayArea} ${colored} ${conflict}`}
      disabled={val !== '' && colored === ''}
    />
  );
}

