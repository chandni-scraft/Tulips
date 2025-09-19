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

  async handleFormSubmit(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const formWrapper = form.closest('.notify-me-form-wrapper');
    const productId = formWrapper.dataset.productId;
    const variantId = formWrapper.dataset.variantId;
    const productTitle = formWrapper.dataset.productTitle || 'Product';
    const variantTitle = formWrapper.dataset.variantTitle || '';
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
      // Use direct submission which is more reliable
      const formBody = new URLSearchParams();
      formBody.append('form_type', 'contact');
      formBody.append('utf8', '✓');
      formBody.append('contact[email]', email);
      formBody.append('contact[body]', `Back in stock notification request:\n\nProduct: ${productTitle}\nVariant: ${variantTitle}\nProduct ID: ${productId}\nVariant ID: ${variantId}`);
      
      console.log('Submitting notification for:', productTitle, 'Email:', email);
      
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '*/*'
        },
        body: formBody.toString()
      });
      
      console.log('Response status:', response.status);
      
      // If fetch fails, try XMLHttpRequest as fallback
      if (!response.ok && response.status !== 302 && !response.redirected) {
        console.log('Fetch failed, trying XMLHttpRequest fallback...');
        
        if (window.submitNotifyMeForm) {
          const productInfo = `Back in stock notification request:\n\nProduct: ${productTitle}\nVariant: ${variantTitle}\nProduct ID: ${productId}\nVariant ID: ${variantId}`;
          await window.submitNotifyMeForm(email, productInfo);
          this.handleSuccess(messageDiv, form, formWrapper);
          return;
        }
      }
      
      // Check for various success conditions
      if (response.ok || response.status === 200 || response.status === 201 || response.status === 302 || response.redirected) {
        this.handleSuccess(messageDiv, form, formWrapper);
      } else if (response.status === 422) {
        // Validation error from Shopify
        throw new Error('Invalid email address or form data');
      } else if (response.status === 404) {
        // Contact endpoint not found
        throw new Error('Contact form endpoint not found');
      } else {
        // Other errors
        const responseText = await response.text();
        console.error('Submission failed. Status:', response.status, 'Response:', responseText);
        throw new Error(`Submission failed with status: ${response.status}`);
      }

    } catch (error) {
      console.error('Error submitting notification:', error);
      // Try to provide more specific error message
      let errorMessage = 'Sorry, there was an error. Please try again.';
      if (error.message && error.message.includes('NetworkError')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message && error.message.includes('Failed')) {
        errorMessage = 'Failed to submit. Please try again later.';
      }
      this.showMessage(messageDiv, errorMessage, 'error');
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