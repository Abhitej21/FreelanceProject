import React from 'react'
import './index.css'

const FilterOptions = (props) => {
    const {changeByDate} = props
    const changeOrder = (event) => {
        const selectedOption = event.target.value
        changeByDate(selectedOption)
    }
    return (
        <div>
            {/* <button type="button"></button> */}
            <div>
                <select className="custom-select" id="sort" onChange={changeOrder}>
                    <option>Sort By Date <i className="fa-regular fa-filter filter"></i></option>
                    <option value="desc">Show Latest</option>
                    <option value="asc">Show Oldest</option>
                </select>
            </div>
        </div>
    )

}


export default FilterOptions