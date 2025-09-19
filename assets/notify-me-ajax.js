// Alternative AJAX submission method
function submitNotifyMeForm(email, productInfo) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/contact', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        console.log('XHR Status:', xhr.status);
        console.log('XHR Response:', xhr.responseText.substring(0, 200));
        
        // Shopify contact forms often redirect on success
        if (xhr.status === 200 || xhr.status === 302 || xhr.status === 0) {
          // Check if response contains success indicators
          const responseText = xhr.responseText.toLowerCase();
          if (responseText.includes('thank you') || 
              responseText.includes('success') || 
              responseText.includes('submitted') ||
              xhr.status === 302 ||
              xhr.status === 0) {
            resolve();
          } else if (responseText.includes('error') || responseText.includes('invalid')) {
            reject(new Error('Form validation failed'));
          } else {
            // Assume success if no error indicators
            resolve();
          }
        } else {
          reject(new Error(`Request failed with status: ${xhr.status}`));
        }
      }
    };
    
    const params = [
      'form_type=contact',
      'utf8=✓',
      `contact[email]=${encodeURIComponent(email)}`,
      `contact[body]=${encodeURIComponent(productInfo)}`
    ].join('&');
    
    xhr.send(params);
  });
}

// Export for use in main notify-me.js
window.submitNotifyMeForm = submitNotifyMeForm;