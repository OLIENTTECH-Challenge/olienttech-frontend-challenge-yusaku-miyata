import styles from './Modal.module.css';
import { ReactNode } from 'react';
import { Button } from '@/components/base/Button';

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
      <div className={styles.modal}>
        {children}
        <div className={styles.modalButton}>
          <Button variant='outlined' onClick={onClose}>
            閉じる
          </Button>
        </div>
      </div>
    </>
  );
};
