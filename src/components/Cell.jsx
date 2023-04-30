import React, {  useEffect, useRef, useState } from 'react'

export default function Cell({ val, grayArea, onChange }) {
    const [colored, setColored] = useState("");
    const ref = useRef();
  
    useEffect(() => {
      ref.current.value = val || "";
    }, [val]);
  
    const handleChange = (e) => {
      onChange(e);
      setColored("userinput");
    };
  
    return (
      <input
        type="number"
        min="1"
        max="9"
        ref={ref}
        onChange={handleChange}
        className={`${grayArea} ${colored}`}
        disabled={val !== "" && colored === ""}
      />
    );
  }
  

