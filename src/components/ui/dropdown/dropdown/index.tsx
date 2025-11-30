import React from 'react';
import { Select } from 'antd';


export type DropdownOption = {
    label: string;
    value: string | number;
};

export type DropdownChangeHandler = (value: string | number) => void;

export interface DropdownProps {
    options: DropdownOption[];
    onChange: DropdownChangeHandler;
    placeholder?: string;
    defaultValue?: string | number;
    disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    onChange,
    placeholder = 'Select an option',
    defaultValue,
    disabled = false,
}) => {
    return (
        <Select
            style={{ width: '100%' }}
            placeholder={placeholder}
            onChange={onChange}
            options={options}
            defaultValue={defaultValue}
            disabled={disabled}
        />
    );
};

export default Dropdown;
