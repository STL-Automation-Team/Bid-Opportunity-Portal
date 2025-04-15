import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table'

export const GlobalFilter = ({ filter, setFilter }) => {
    const [value, setValue] = useState(filter)
    const onChange = useAsyncDebounce((value) => {
        setFilter(value || undefined)
    }, 400)
    return (
        <span>
            <input 
                value={value || ''} 
                onChange={(e) => {
                    setValue(e.target.value)
                    onChange(e.target.value)
                }}
                placeholder="Search"
            />
        </span>
    )
}