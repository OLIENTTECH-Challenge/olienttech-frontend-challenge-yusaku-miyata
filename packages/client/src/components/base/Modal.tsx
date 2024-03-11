import styles from './Modal.module.css';
import { ReactNode } from 'react';

type ModalHeaderProps = {
  children: ReactNode;
};

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children }: ModalHeaderProps) => {
  return <div className={styles.modalHeader}>{children}</div>;
};

type ModalBodyProps = {
  children: ReactNode;
};

export const ModalBody: React.FC<ModalBodyProps> = ({ children }: ModalBodyProps) => {
  return <div className={styles.modalBody}>{children}</div>;
};

type ModalFooterProps = {
  children: ReactNode;
};

export const ModalFooter: React.FC<ModalFooterProps> = ({ children }: ModalFooterProps) => {
  return <div className={styles.modalFooter}>{children}</div>;
};

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>{children}</div>
    </>
  );
};
