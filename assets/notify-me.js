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
    console.log('Notify button clicked');
    const productForm = button.closest('product-form');
    if (!productForm) {
      console.error('Product form not found');
      return;
    }
    
    const notifyFormWrapper = productForm.querySelector('.notify-me-form-wrapper');
    console.log('Notify form wrapper:', notifyFormWrapper);
    
    if (notifyFormWrapper) {
      notifyFormWrapper.hidden = false;
      notifyFormWrapper.style.display = 'block';
      const emailInput = notifyFormWrapper.querySelector('input[type="email"]');
      if (emailInput) {
        emailInput.focus();
      }
    } else {
      console.error('Notify form wrapper not found');
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

  async handleFormSubmit(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const formWrapper = form.closest('.notify-me-form-wrapper');
    const productId = formWrapper.dataset.productId;
    const variantId = formWrapper.dataset.variantId;
    const submitButton = form.querySelector('.notify-me-form__submit');
    const buttonText = submitButton.querySelector('.button-text');
    const spinner = submitButton.querySelector('.loading__spinner');
    const messageDiv = form.querySelector('.notify-me-form__message');
    
    if (!this.validateEmail(email)) {
      this.showMessage(messageDiv, 'Please enter a valid email address.', 'error');
      return;
    }

    submitButton.disabled = true;
    buttonText.textContent = 'Submitting...';
    spinner.classList.remove('hidden');
    
    try {
      const response = await fetch('/contact#notify-me-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: new URLSearchParams({
          'form_type': 'contact',
          'utf8': '✓',
          'contact[email]': email,
          'contact[body]': `Back in stock notification request for Product ID: ${productId}, Variant ID: ${variantId}`,
          'contact[product_id]': productId,
          'contact[variant_id]': variantId,
          'contact[tags]': 'back-in-stock'
        })
      });

      if (response.ok) {
        this.showMessage(messageDiv, 'Success! You\'ll be notified when this item is back in stock.', 'success');
        setTimeout(() => {
          this.hideNotifyForm(formWrapper);
        }, 3000);
      } else {
        throw new Error('Failed to submit notification request');
      }
    } catch (error) {
      console.error('Error submitting notification:', error);
      this.showMessage(messageDiv, 'Sorry, there was an error. Please try again.', 'error');
    } finally {
      submitButton.disabled = false;
      buttonText.textContent = window.shopifyTranslations?.notify_me_button || 'Notify me';
      spinner.classList.add('hidden');
    }
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