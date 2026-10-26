import * as React from 'react';

export type IconName =
  | 'refresh'
  | 'minus'
  | 'plus'
  | 'folder'
  | 'trash'
  | 'check'
  | 'checkbox'
  | 'arrow-down'
  | 'arrow-up'
  | 'shuffle'
  | 'postpone'
  | 'pencil'
  | 'expand'
  | 'collapse'
  | 'shield'
  | 'shield-check'
  | 'list'
  | 'sun'
  | 'chevron-left'
  | 'cog';

interface IconProps {
  name: IconName;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Renders a <use> reference into the icon sprite defined once in index.html.
 */
const Icon: React.FunctionComponent<IconProps> = ({ name, className, onClick }) => (
  <svg className={className ? `icon ${className}` : 'icon'} aria-hidden="true" onClick={onClick}>
    <use href={`#i-${name}`} />
  </svg>
);

export default Icon;
