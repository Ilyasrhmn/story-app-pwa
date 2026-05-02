import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const showToast = (message, icon = 'success') => {
  Toast.fire({
    icon,
    title: message,
  });
};

export const showAlert = (title, text, icon = 'info') => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: '#0284c7', // Primary 600
    confirmButtonText: 'Got it',
    backdrop: `rgba(15, 23, 42, 0.4)`, // Slate 900 with opacity
    customClass: {
      popup: 'rounded-[2rem] p-8',
      confirmButton: 'btn-primary px-8 py-3 rounded-xl',
    },
  });
};

export const showConfirm = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0284c7',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'Cancel',
    backdrop: `rgba(15, 23, 42, 0.4)`,
    customClass: {
      popup: 'rounded-[2rem] p-8',
      confirmButton: 'btn-primary px-8 py-3 rounded-xl',
      cancelButton: 'btn-secondary px-8 py-3 rounded-xl',
    },
  });
};
