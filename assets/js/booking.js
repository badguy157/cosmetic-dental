/**
 * Booking Modal Script
 * Manages 3-state modal flow: details → confirm → success
 */
(function() {
  var modal = document.getElementById('bookingModal');
  var form = document.getElementById('bookingForm');
  var formContent = modal ? modal.querySelector('[data-state="form"]') : null;
  var confirmContent = modal ? modal.querySelector('[data-state="confirm"]') : null;
  var successContent = modal ? modal.querySelector('[data-state="success"]') : null;

  // Exit early if modal or required elements don't exist on this page
  if (!modal || !form || !formContent || !confirmContent || !successContent) {
    return;
  }

  // Single state object for form data
  var state = {
    name: '',
    phone: '',
    email: '',
    treatment: '',
    treatmentText: '',
    time: '',
    timeText: '',
    notes: ''
  };

  // Get all form inputs for easy access
  var inputs = {
    name: document.getElementById('booking-name'),
    phone: document.getElementById('booking-phone'),
    email: document.getElementById('booking-email'),
    treatment: document.getElementById('booking-treatment'),
    time: document.getElementById('booking-time'),
    notes: document.getElementById('booking-notes')
  };

  // Open modal when any element with data-open-booking is clicked
  document.addEventListener('click', function(e) {
    var trigger = e.target.closest('[data-open-booking]');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  // Close modal when clicking close button or backdrop
  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-close-modal]')) {
      closeModal();
    }
  });

  // Edit button - return to Step 1 preserving values
  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-edit-booking]')) {
      // Values are already in the form, just show the form step
      showStep('form');
    }
  });

  // Confirm button - show success and reset
  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-confirm-booking]')) {
      submitBooking();
    }
  });

  // Close on escape key from any step
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Real-time validation - clear errors when user types
  if (inputs.phone) {
    inputs.phone.addEventListener('input', function() {
      if (this.value.trim()) {
        clearFieldError(this);
        // Also clear email error if it was about phone/email requirement
        var emailError = document.getElementById('booking-email-error');
        if (emailError && emailError.textContent.indexOf('phone or email') !== -1) {
          clearFieldError(inputs.email);
        }
      }
    });
  }
  
  if (inputs.email) {
    inputs.email.addEventListener('input', function() {
      if (this.value.trim()) {
        clearFieldError(this);
        // Also clear phone error if it was about phone/email requirement
        var phoneError = document.getElementById('booking-phone-error');
        if (phoneError && phoneError.textContent.indexOf('phone or email') !== -1) {
          clearFieldError(inputs.phone);
        }
      }
    });
  }

  // Clear errors on input for other required fields
  if (inputs.name) {
    inputs.name.addEventListener('input', function() {
      if (this.value.trim()) clearFieldError(this);
    });
  }
  
  if (inputs.treatment) {
    inputs.treatment.addEventListener('change', function() {
      if (this.value) clearFieldError(this);
    });
  }
  
  if (inputs.time) {
    inputs.time.addEventListener('change', function() {
      if (this.value) clearFieldError(this);
    });
  }

  // Handle form submission (Step 1 -> Step 2)
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear all previous errors
    clearAllErrors();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Store form data from inputs into state
    readFormIntoState();
    
    // Show confirmation step
    showStep('confirm');
    displayConfirmation();
  });

  function validateForm() {
    var isValid = true;
    var firstInvalidField = null;
    
    // Validate name (required)
    if (!inputs.name.value.trim()) {
      showFieldError(inputs.name, 'Please enter your full name');
      if (!firstInvalidField) firstInvalidField = inputs.name;
      isValid = false;
    }
    
    // Validate phone OR email (at least one required)
    var hasPhone = inputs.phone.value.trim();
    var hasEmail = inputs.email.value.trim();
    
    if (!hasPhone && !hasEmail) {
      showFieldError(inputs.phone, 'Please provide a phone or email');
      showFieldError(inputs.email, 'Please provide a phone or email');
      if (!firstInvalidField) firstInvalidField = inputs.phone;
      isValid = false;
    }
    
    // Validate treatment (required)
    if (!inputs.treatment.value) {
      showFieldError(inputs.treatment, 'Please select a treatment');
      if (!firstInvalidField) firstInvalidField = inputs.treatment;
      isValid = false;
    }
    
    // Validate preferred time (required)
    if (!inputs.time.value) {
      showFieldError(inputs.time, 'Please select a preferred time');
      if (!firstInvalidField) firstInvalidField = inputs.time;
      isValid = false;
    }
    
    // Focus first invalid field and scroll into view
    if (firstInvalidField) {
      firstInvalidField.focus();
      // Scroll within modal
      setTimeout(function() {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
    
    return isValid;
  }

  function showFieldError(field, message) {
    var errorId = field.id + '-error';
    var errorElement = document.getElementById(errorId);
    
    // Create error element if it doesn't exist
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'field-error';
      errorElement.setAttribute('role', 'alert');
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
  }

  function clearFieldError(field) {
    var errorId = field.id + '-error';
    var errorElement = document.getElementById(errorId);
    
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }

  function clearAllErrors() {
    var allInputs = form.querySelectorAll('input, select, textarea');
    for (var i = 0; i < allInputs.length; i++) {
      clearFieldError(allInputs[i]);
    }
  }

  function readFormIntoState() {
    // Read current form values into state object
    state.name = inputs.name.value.trim();
    state.phone = inputs.phone.value.trim();
    state.email = inputs.email.value.trim();
    state.treatment = inputs.treatment.value;
    state.treatmentText = inputs.treatment.options[inputs.treatment.selectedIndex].text;
    state.time = inputs.time.value;
    state.timeText = inputs.time.options[inputs.time.selectedIndex].text;
    state.notes = inputs.notes.value.trim();
  }

  function displayConfirmation() {
    // Update confirmation display with state data using textContent (not innerHTML)
    var confirmName = document.getElementById('confirm-name');
    var confirmPhone = document.getElementById('confirm-phone');
    var confirmEmail = document.getElementById('confirm-email');
    var confirmTreatment = document.getElementById('confirm-treatment');
    var confirmTime = document.getElementById('confirm-time');
    var confirmNotes = document.getElementById('confirm-notes');
    
    if (confirmName) confirmName.textContent = state.name;
    if (confirmPhone) confirmPhone.textContent = state.phone || '—';
    if (confirmEmail) confirmEmail.textContent = state.email || '—';
    if (confirmTreatment) confirmTreatment.textContent = state.treatmentText;
    if (confirmTime) confirmTime.textContent = state.timeText;
    if (confirmNotes) confirmNotes.textContent = state.notes || '—';
  }

  function submitBooking() {
    // Here you would normally send state data to a server
    // For now, we'll just show the success message
    showStep('success');
  }

  function showStep(step) {
    formContent.hidden = true;
    confirmContent.hidden = true;
    successContent.hidden = true;
    
    if (step === 'form') {
      formContent.hidden = false;
      // Focus first input
      setTimeout(function() {
        if (inputs.name) inputs.name.focus();
      }, 100);
    } else if (step === 'confirm') {
      confirmContent.hidden = false;
      // Focus edit button
      setTimeout(function() {
        var editButton = confirmContent.querySelector('[data-edit-booking]');
        if (editButton) editButton.focus();
      }, 100);
    } else if (step === 'success') {
      successContent.hidden = false;
      // Focus close button
      setTimeout(function() {
        var closeButton = successContent.querySelector('[data-close-modal]');
        if (closeButton) closeButton.focus();
      }, 100);
    }
  }

  function resetModal() {
    // Reset to Step 1
    showStep('form');
    // Clear all errors
    clearAllErrors();
    // Reset form inputs
    form.reset();
    // Clear state
    state = {
      name: '',
      phone: '',
      email: '',
      treatment: '',
      treatmentText: '',
      time: '',
      timeText: '',
      notes: ''
    };
  }

  function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Always start at Step 1 when opening modal
    resetModal();
    
    // Focus first input
    setTimeout(function() {
      if (inputs.name) inputs.name.focus();
    }, 100);
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Reset modal after close animation
    setTimeout(function() {
      resetModal();
    }, 300);
  }
})();
