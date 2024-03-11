import React from 'react';
import styles from './Button.module.css';
import { classNames } from '@/libs/utils';

type HTMLButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonProps = {
  variant: 'outlined' | 'filled';
  isLoading?: boolean;
  isDisabled?: boolean;
} & Pick<HTMLButtonProps, 'children' | 'onClick'>;

export const Button = ({ children, variant, onClick, isLoading, isDisabled }: ButtonProps) => {
  const buttonClass = isLoading ? `${styles.button} ${styles['loading']}` : styles.button;

  return (
    <button className={classNames(buttonClass, styles[variant])} onClick={onClick} disabled={isLoading || isDisabled}>
      {isLoading ? <div className={styles.spinner}></div> : children}
    </button>
  );
};
