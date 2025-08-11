(() => {
    'use strict'
  
  const forms = document.querySelectorAll('.validated-form')
  
  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// const priceInput = document.getElementById('price');
// priceInput.addEventListener('input', () => {
//   // Hilangkan pesan invalid bawaan step
//   if (priceInput.validity.stepMismatch) {
//     priceInput.setCustomValidity(""); // Anggap tetap valid
//   } else {
//     priceInput.setCustomValidity("");
//   }
// });