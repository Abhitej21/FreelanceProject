import React,{useState} from 'react'
import './index.css'

const ToggleMode = () => {
    const [isDark,setIsDark] = useState(false)
    return (
        <div className="toggle-switch">
            <label className="switch-label">
                <input type="checkbox" className="checkbox" />
                <span className="slider-mode" />
            </label>
        </div>

    )
}

export default ToggleMode