// Add click event listeners for the service cards
document.querySelectorAll('.service-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // This will be replaced with actual navigation logic later
      console.log('Navigating to:', e.target.textContent);
    });
  });
  
  // Add click event listener for the login button
  document.querySelector('.login-btn').addEventListener('click', () => {
    // This will be replaced with actual login logic later
    console.log('Login clicked');
  });