import React, { useImperativeHandle, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface PromiseResponse {
  resolve: (value: boolean | PromiseLike<boolean>) => void;
  reject: (value: boolean | PromiseLike<boolean>) => void;
}

export type ModalComponentHandle = {
  /**
   * Open a modal and wait for a reply (async)
   * @param title the modal title
   * @param message the modal body message
   * @returns true if user accepted, false otherwise.
   */
  open: (title: string, message: string) => Promise<boolean>;
};

type Props = {};

const ModalComponent = React.forwardRef<ModalComponentHandle, Props>(
  (props, ref): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [promiseRes, setPromiseRes] = useState<PromiseResponse>();

    useImperativeHandle(ref, () => ({
      open: async (title: string, message: string): Promise<boolean> => {
        setTitle(title);
        setMessage(message);
        setIsOpen(true);
        return new Promise<boolean>((resolve, reject) => {
          setPromiseRes({ resolve, reject });
        });
      }
    }));

    return (
      <Modal show={isOpen}>
        <Modal.Header translate="no">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{message}</Modal.Body>

        <Modal.Footer>
          <Button
            variant={'outline-dark'}
            onClick={(): void => {
              setIsOpen(false);
              promiseRes?.resolve(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(): void => {
              setIsOpen(false);
              promiseRes?.resolve(true);
            }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
);

export default ModalComponent;
