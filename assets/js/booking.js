/**
 * Booking Modal Script
 * Handles opening/closing the booking modal and form submission
 */
(function() {
  var modal = document.getElementById('bookingModal');
  var form = document.getElementById('bookingForm');
  var formContent = modal ? modal.querySelector('[data-state="form"]') : null;
  var successContent = modal ? modal.querySelector('[data-state="success"]') : null;

  // Exit early if modal doesn't exist on this page
  if (!modal || !form) {
    return;
  }

  // Open modal when any element with data-open-booking is clicked
  document.addEventListener('click', function(e) {
    var trigger = e.target.closest('[data-open-booking]');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  // Close modal
  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-close-modal]')) {
      closeModal();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate required fields
    var requiredFields = form.querySelectorAll('[required]');
    var isValid = true;
    
    for (var i = 0; i < requiredFields.length; i++) {
      if (!requiredFields[i].value.trim()) {
        isValid = false;
        requiredFields[i].focus();
        break;
      }
    }
    
    if (!isValid) {
      return;
    }
    
    // Hide form, show success
    formContent.hidden = true;
    successContent.hidden = false;
    
    // Reset form for next use
    form.reset();
  });

  function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Reset to form view
    formContent.hidden = false;
    successContent.hidden = true;
    
    // Focus first input
    setTimeout(function() {
      var firstInput = form.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Reset to form view after animation
    setTimeout(function() {
      formContent.hidden = false;
      successContent.hidden = true;
    }, 300);
  }
})();
