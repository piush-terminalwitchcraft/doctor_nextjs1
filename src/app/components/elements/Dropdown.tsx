import React, { useState, useEffect, useRef } from 'react';
import './style.css'

interface DropdownProps<T> {
  items: T[];
  initialSelectedItem: T;
  onSelectItem: (selectedItem: T) => void;
  renderOption: (item: T) => React.ReactNode;
}

 const Dropdown = <T extends {}>(props: DropdownProps<T>) => {
  const { items, onSelectItem, renderOption, initialSelectedItem } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T>(initialSelectedItem);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectItem = (item: T) => {
    setSelectedItem(item);
    onSelectItem(item); // Call the callback function with the selected item
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="dropdown-options border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                onClick={toggleDropdown}
            >
                {selectedItem ? renderOption(selectedItem) : 'Select an item'}
            </button>
            {isOpen && (
                <div className="dropdown-menu fixed mt-2 w-40 bg-white rounded shadow max-h-24 z-10 overflow-y-scroll">
                    {items.map((item, index) => (
                        <button
                            key={index}
                            className="dropdown-options block w-full text-left focus:outline-none"
                            onClick={() => selectItem(item)}
                        >
                            {renderOption(item)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
