
const confirmWarning = (title, message) => {
  return swal.fire({
    title: title,
    text: message,
    icon: "warning",
    buttons: true,
    dangerMode: true,
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-secondary'
    }
  })
};

