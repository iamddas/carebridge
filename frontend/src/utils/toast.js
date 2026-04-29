import { toast } from 'react-toastify';

const opts = { position: 'top-right', autoClose: 3500 };

export const showSuccess = (msg) => toast.success(msg, opts);
export const showError   = (msg) => toast.error(msg, opts);
export const showInfo    = (msg) => toast.info(msg, opts);
export const showWarning = (msg) => toast.warning(msg, opts);
