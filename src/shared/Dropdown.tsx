import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import Icon, { IconName } from './Icon';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  icon?: IconName;
  emptyLabel?: string;
}

const Dropdown: React.FunctionComponent<DropdownProps> = ({ label, options, onSelect, icon, emptyLabel }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOutsideClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const choose = (value: string) => {
    setOpen(false);
    onSelect(value);
  };

  return (
    <div className={open ? 'dropdown dropdown-open' : 'dropdown'} ref={rootRef}>
      <button
        type="button"
        className="rounded-button dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {icon && <Icon name={icon} />}
        <span>{label}</span>
        <Icon name="chevron-down" className="dropdown-chevron" />
      </button>
      {open && (
        <div className="dropdown-menu" role="listbox">
          {options.length === 0 && <div className="dropdown-empty">{emptyLabel || 'Nothing here'}</div>}
          {options.map((option) => (
            <div key={option.value} className="dropdown-option" role="option" aria-selected={false} onClick={() => choose(option.value)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
