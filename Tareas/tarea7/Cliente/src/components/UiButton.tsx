import type {MouseEventHandler, ReactNode} from 'react';

export interface Props {
  href?: string;
  type?: 'button' | 'submit';
  isActive?: boolean;
  class?: string;
  className?: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>; 
}



export function CustomButton({
  href,
  type = 'button',
  isActive = false, 
  class: classAttr = '',
  className = '',
  children,
  onClick,
}: Props) {
  const baseStyles = `
    px-2 py-1 
    bg-[antiquewhite] 
    border border-[burlywood] 
    rounded 
    cursor-pointer
    text-[chocolate]
    no-underline
    transition-all
    hover:bg-[#e6d5c3]
  `;

  const activeStyles = isActive ? 'bg-[burlywood] text-white' : '';
  const finalClass = `${baseStyles} ${activeStyles} ${className || classAttr}`.trim();

  return href ? (
    <a href={href} className={finalClass}>
      {children}
    </a>
  ) : (
    <button type={type} className={finalClass} onClick={onClick}>
      {children}
    </button>
  );
}
