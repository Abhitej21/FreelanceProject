import React from 'react'
import './index.css'

const ToggleMode = () => {
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