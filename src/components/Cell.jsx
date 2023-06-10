import {  useEffect, useState } from "react";

export default function Cell({ val, grayArea, onChange, conflict, hint, restart, mapKey }) {
  const [colored, setColored] = useState('');

  const handleChange = (e) => {
    onChange(e);
    setColored('userinput');
  };

  useEffect(() => {
    if (restart) {
      setColored('');
    }
  }, [restart]);

  return (
    <input
      type="number"
      min="1"
      max="9"
      id={mapKey}
      name={mapKey}
      value={val}
      onChange={handleChange}
      className={`${grayArea} ${colored} ${conflict} ${hint}`}
      disabled={val !== '' && colored === ''}
    />
  );
}
