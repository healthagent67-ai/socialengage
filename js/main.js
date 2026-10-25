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

  function setupForm(formId, successId, errorId, buttonId, label) {
    var form = document.getElementById(formId);
    var success = document.getElementById(successId);
    var errorMsg = document.getElementById(errorId);
    var submitBtn = document.getElementById(buttonId);

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
          submitBtn.textContent = label;
        });
    });
  }

  setupForm('auditForm', 'formSuccess', 'formError', 'auditSubmitBtn', 'Get My Free Mockup');
  setupForm('contactForm', 'contactSuccess', 'contactError', 'contactSubmitBtn', 'Send My Message');

  // Contact form: only ask for a URL when they already have a site
  var hasWebsite = document.getElementById('hasWebsite');
  var urlRow = document.getElementById('websiteUrlRow');
  var urlInput = document.getElementById('contactWebsite');

  hasWebsite.addEventListener('change', function () {
    var hasSite = hasWebsite.value.indexOf('Yes') === 0;
    urlRow.hidden = !hasSite;
    urlInput.required = hasSite;
    if (!hasSite) urlInput.value = '';
  });
});
