// Simple client-side credential check for demo/routing only.
// DO NOT use this pattern for real authentication.
(function () {
  const form = document.querySelector('.login-form');
  const userEl = document.getElementById('login-username');
  const passEl = document.getElementById('login-password');
  const errorEl = document.getElementById('login-error');

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.style.display = msg ? 'block' : 'none';
  }

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const u = (userEl?.value || '').trim();
    const p = passEl?.value || '';

    const validUser = 'shehzad.hakim@g.bracu.ac.bd';
    const validPass = 'Shehzadhakim@@@799';

    if (u === validUser && p === validPass) {
      // Navigate to the student dashboard route
      const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
      if (window.location.protocol === 'file:' || isLocalHost) {
        // Local preview or dev server: navigate to the file directly
        window.location.href = 'studentdashboard.html';
      } else {
        // Hosted (e.g., Vercel): use the clean route (rewritten to the HTML file)
        window.location.href = '/studentdashboard';
      }
    } else {
      showError('Invalid username or password.');
    }
  });
})();
