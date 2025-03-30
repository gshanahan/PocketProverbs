// alerts.js
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.5.0/dist/sweetalert2.all.min.js';

// Function for displaying a simple alert
export function showSimpleAlert(title, text) {
  Swal.fire({
    title: title,
    text: text,
    icon: 'info',
    confirmButtonText: 'OK'
  });
}

// Function for success alert
export function showSuccessAlert(title, text) {
  Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    confirmButtonText: 'Great!'
  });
}

// Function for error alert
export function showErrorAlert(title, text) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonText: 'Try Again'
  });
}

// Function for confirmation dialog (Yes/No)
export function showConfirmationDialog(title, text, confirmText, cancelText) {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText || 'Yes',
    cancelButtonText: cancelText || 'No'
  });
}

// Function for input dialog
export function showInputDialog(title, inputLabel, inputPlaceholder) {
  return Swal.fire({
    title: title,
    input: 'text',
    inputLabel: inputLabel,
    inputPlaceholder: inputPlaceholder,
    showCancelButton: true
  });
}

// Function to display custom HTML in alert
export function showCustomHTMLAlert(title, htmlContent) {
  Swal.fire({
    title: title,
    html: htmlContent,
    icon: 'info',
    confirmButtonText: 'Close'
  });
}
