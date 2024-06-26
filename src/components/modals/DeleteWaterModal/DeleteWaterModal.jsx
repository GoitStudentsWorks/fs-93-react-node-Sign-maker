import React from 'react';
import css from './DeleteWaterModal.module.css';
import { IoCloseOutline } from 'react-icons/io5';
import { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useWater } from 'hooks/useWater';
import {
  toastFulfilled,
  toastRejected,
} from 'components/servises/UserNotification';

const DeleteWaterModal = ({ onClose, deleteRecordId }) => {
  const { deleteWater } = useWater();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteWater({ _id: deleteRecordId });
      toastFulfilled('Delete success');
      onClose();
    } catch (error) {
      toastRejected(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={css.modal_content}>
        <div className={css.header}>
          <h2 className={css.title}>Delete entry</h2>
          <button type="button" value='close button' className={css.btn_close} onClick={onClose}>
            <IoCloseOutline className={css.icon_close} />
          </button>
        </div>
        <p className={css.modal_text}>
          Are you sure you want to delete the entry?
        </p>

        <div className={css.btn_container}>
          <button type="button" value='close cancel' className={css.btn_cancel} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            value='logout button'
            className={css.btn_logout}
            onClick={handleDelete}
          >
            {loading && <ClipLoader size={24} color="#ffffff" />} Delete{' '}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteWaterModal;
