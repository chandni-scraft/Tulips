class NotifyMe {
  constructor() {
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.addEventListener('click', (e) => {
      const notifyTrigger = e.target.closest('.notify-me-trigger');
      if (notifyTrigger && notifyTrigger.hasAttribute('data-action') && notifyTrigger.getAttribute('data-action') === 'notify-me') {
        e.preventDefault();
        e.stopPropagation();
        this.showNotifyForm(notifyTrigger);
      }
      
      if (e.target.closest('.notify-me-form__close')) {
        e.preventDefault();
        this.hideNotifyForm(e.target.closest('.notify-me-form-wrapper'));
      }
    });

    document.addEventListener('submit', (e) => {
      if (e.target.classList.contains('notify-me-form')) {
        e.preventDefault();
        this.handleFormSubmit(e.target);
      }
    });

    document.addEventListener('variant:changed', (e) => {
      this.updateButtonState();
    });
  }

  showNotifyForm(button) {
    const productForm = button.closest('product-form');
    if (!productForm) {
      return;
    }
    
    const notifyFormWrapper = productForm.querySelector('.notify-me-form-wrapper');
    
    if (notifyFormWrapper) {
      notifyFormWrapper.hidden = false;
      notifyFormWrapper.style.display = 'block';
      const emailInput = notifyFormWrapper.querySelector('.notify-me-field__input');
      if (emailInput) {
        setTimeout(() => emailInput.focus(), 100);
      }
    }
  }

  hideNotifyForm(formWrapper) {
    formWrapper.hidden = true;
    const form = formWrapper.querySelector('form');
    const messageDiv = form.querySelector('.notify-me-form__message');
    
    form.reset();
    messageDiv.hidden = true;
    messageDiv.textContent = '';
    messageDiv.classList.remove('success', 'error');
  }

  handleFormSubmit(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const formWrapper = form.closest('.notify-me-form-wrapper');
    const productId = formWrapper.dataset.productId;
    const variantId = formWrapper.dataset.variantId;
    const productTitle = formWrapper.dataset.productTitle || 'Product';
    const variantTitle = formWrapper.dataset.variantTitle || '';
    const messageDiv = form.querySelector('.notify-me-form__message');
    
    if (!this.validateEmail(email)) {
      this.showMessage(messageDiv, 'Please enter a valid email address.', 'error');
      return;
    }

    // Create a real form and submit it (this will handle reCAPTCHA if needed)
    const tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = '/contact';
    tempForm.style.display = 'none';
    
    // Add form fields
    const fields = {
      'form_type': 'contact',
      'utf8': '✓',
      'contact[email]': email,
      'contact[tags]': 'back-in-stock',
      'contact[body]': `Back in stock notification request:\n\nProduct: ${productTitle}\nVariant: ${variantTitle}\nProduct ID: ${productId}\nVariant ID: ${variantId}\nEmail: ${email}`
    };
    
    // Create hidden inputs for each field
    Object.keys(fields).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key];
      tempForm.appendChild(input);
    });
    
    // Append form to body and submit
    document.body.appendChild(tempForm);
    tempForm.submit();
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  showMessage(messageDiv, message, type) {
    messageDiv.textContent = message;
    messageDiv.classList.remove('success', 'error');
    messageDiv.classList.add(type);
    messageDiv.hidden = false;
  }

  handleSuccess(messageDiv, form, formWrapper) {
    this.showMessage(messageDiv, 'Success! You\'ll be notified when this item is back in stock.', 'success');
    form.reset();
    setTimeout(() => {
      this.hideNotifyForm(formWrapper);
    }, 3000);
  }

  updateButtonState() {
    const button = document.querySelector('.product-form__submit');
    if (!button) return;

    const variant = button.form?.querySelector('[name="id"]:checked')?.value;
    const variantData = window.variantData?.[variant];
    
    if (variantData && !variantData.available) {
      button.classList.add('notify-me-trigger');
      button.setAttribute('data-action', 'notify-me');
      
      const soldOutText = button.querySelector('.sold-out-text');
      const notifyText = button.querySelector('.notify-me-text');
      
      if (soldOutText) soldOutText.classList.add('hidden');
      if (notifyText) notifyText.classList.remove('hidden');
    } else {
      button.classList.remove('notify-me-trigger');
      button.removeAttribute('data-action');
      
      const soldOutText = button.querySelector('.sold-out-text');
      const notifyText = button.querySelector('.notify-me-text');
      
      if (soldOutText) soldOutText.classList.remove('hidden');
      if (notifyText) notifyText.classList.add('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (typeof window.notifyMe === 'undefined') {
    window.notifyMe = new NotifyMe();
  }
});