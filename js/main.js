document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', function () {
    mainNav.classList.toggle('open');
  });

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
    });
  });

  var form = document.getElementById('auditForm');
  var success = document.getElementById('formSuccess');
  var errorMsg = document.getElementById('formError');
  var submitBtn = document.getElementById('auditSubmitBtn');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    errorMsg.classList.remove('visible');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          form.classList.add('hidden');
          success.classList.add('visible');
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      })
      .catch(function () {
        errorMsg.classList.add('visible');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get My Free Audit';
      });
  });
});
