import React, {  useState } from 'react'

export default function Cell({val, grayArea}) {
    const [value, setValue] = useState(val)
    const [colored, setColored] = useState(false)
    const handleChange = (e) => {
        setValue(e.target.value)
        setColored(true)
    }


    return (
        <input
          type="number"
          min="1"
          max="9"
          onChange={handleChange}
          value={value}
          className={grayArea ? 'odd' : "" ||  colored ? "userinput" : "" && val !== 0 ? "colored" : ""}
        />
    )
}


