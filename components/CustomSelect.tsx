import React, { useState } from 'react';
import Image from 'next/image';

interface Option {
  value: string;
  label: string;
  logo: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function CustomSelect({ options, value, onChange, placeholder }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="custom-select">
      <div 
        className="select-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? (
          <div className="selected-option">
            <Image 
              src={selectedOption.logo}
              alt={selectedOption.label}
              width={20}
              height={20}
              className="option-image"
            />
            <span>{selectedOption.label}</span>
          </div>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
      </div>
      
      {isOpen && (
        <div className="options-container">
          {options.map((option) => (
            <div
              key={option.value}
              className={`option ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <Image 
                src={option.logo}
                alt={option.label}
                width={20}
                height={20}
                className="option-image"
              />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 