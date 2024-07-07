
const confirmWarning = (title, message) => {
  return swal.fire({
    title: title,
    text: message,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
};

