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

    // Remove the form submit handler since Shopify form will handle it naturally

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