import Swal from 'sweetalert2';

export const showSuccess = (message) => {
  Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    background: '#0b1221',
    color: '#fff',
    confirmButtonColor: '#00ff9d'
  });
};