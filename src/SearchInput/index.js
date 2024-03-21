// Import necessary modules
import React from 'react';
import styled from 'styled-components';
// Import Font Awesome styles
import '@fortawesome/fontawesome-free/css/all.css';


// Define styled components
const SearchContainer = styled.div`
  display: flex;
  width: 500px;
  height: 60px;
  align-items: center;
  background-color: #fff;
  border-radius: 35px;
  border: 3px solid green;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchIcon = styled.div`
  padding: 10px;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 0 8px 8px 0;
  border:none;
  outline: none;
  width: 420px; /* Adjust the width as needed */
  font-size: 16px;
`;

// SearchInput component
const SearchInput = ({ placeholder, value,onChange,onKeyDown }) => {
  return (
    <SearchContainer>
      <SearchIcon>
        <i className="fa fa-search"></i>
      </SearchIcon>
      <Input
        type="text"
        value={value}
        onKeyDown={onKeyDown}
        placeholder={placeholder || 'Search...'}
        onChange={onChange}
      />
    </SearchContainer>
  );
};

export default SearchInput;
