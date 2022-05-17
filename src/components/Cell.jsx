import React, { useState } from 'react'

export default function Cell({ val, grayArea }) {
    const [value, setValue] = useState(val)
    const [colored, setColored] = useState('')
    const handleChange = (e) => {
        setValue(e.target.value)
        setColored('userinput')
    }


    return (
        <input
            type="number"
            min="1" 
            max="9"
            onChange={handleChange} 
            value={value}
            className={`${grayArea} ${colored}`}
            disabled={(value !== '' &&  colored === '') ? true : false}
        />
    )
}


