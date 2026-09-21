(function(){
  "use strict";

  function showPage(id){
    document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
    document.getElementById('page-' + id).classList.add('active');
  }

  document.getElementById('go-signup').addEventListener('click', function(){ showPage('signup'); });
  document.getElementById('go-signin').addEventListener('click', function(){ showPage('signin'); });
  document.querySelectorAll('[data-back]').forEach(function(btn){
    btn.addEventListener('click', function(){ showPage(btn.getAttribute('data-back')); });
  });
  document.querySelectorAll('[data-goto]').forEach(function(link){
    link.addEventListener('click', function(){ showPage(link.getAttribute('data-goto')); });
  });

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(inputEl, errorEl, message){
    if (message){
      inputEl.classList.add('invalid');
      inputEl.classList.remove('valid');
      errorEl.textContent = message;
      errorEl.classList.add('show');
      return false;
    } else {
      inputEl.classList.remove('invalid');
      inputEl.classList.add('valid');
      errorEl.textContent = '';
      errorEl.classList.remove('show');
      return true;
    }
  }

  function validateEmail(inputEl, errorEl){
    var val = inputEl.value.trim();
    if (val === '') return setError(inputEl, errorEl, 'Email is required.');
    if (!EMAIL_RE.test(val)) return setError(inputEl, errorEl, 'Enter a valid email.');
    return setError(inputEl, errorEl, '');
  }
  function validateUsername(inputEl, errorEl){
    var val = inputEl.value.trim();
    if (val === '') return setError(inputEl, errorEl, 'Username is required.');
    return setError(inputEl, errorEl, '');
  }
  function validateSignupPassword(inputEl, errorEl){
    var val = inputEl.value;
    if (val === '') return setError(inputEl, errorEl, 'Password is required.');
    if (val.length < 8) return setError(inputEl, errorEl, 'Must be 8+ characters.');
    if (!/\d/.test(val)) return setError(inputEl, errorEl, 'Add at least one number.');
    return setError(inputEl, errorEl, '');
  }
  function validateRequired(inputEl, errorEl, label){
    if (inputEl.value === '') return setError(inputEl, errorEl, label + ' is required.');
    return setError(inputEl, errorEl, '');
  }
  function showBanner(bannerEl, message, type){
    bannerEl.textContent = message;
    bannerEl.className = 'banner show ' + type;
  }

  // Sign Up 
  var suForm = document.getElementById('signup-form');
  var suEmail = document.getElementById('su-email');
  var suUsername = document.getElementById('su-username');
  var suPassword = document.getElementById('su-password');
  var suEmailErr = document.getElementById('su-email-error');
  var suUsernameErr = document.getElementById('su-username-error');
  var suPasswordErr = document.getElementById('su-password-error');
  var suBanner = document.getElementById('signup-banner');
  var suSubmitBtn = document.getElementById('signup-submit');

  suEmail.addEventListener('blur', function(){ validateEmail(suEmail, suEmailErr); });
  suEmail.addEventListener('input', function(){ if (suEmail.classList.contains('invalid')) validateEmail(suEmail, suEmailErr); });
  suUsername.addEventListener('blur', function(){ validateUsername(suUsername, suUsernameErr); });
  suUsername.addEventListener('input', function(){ if (suUsername.classList.contains('invalid')) validateUsername(suUsername, suUsernameErr); });
  suPassword.addEventListener('blur', function(){ validateSignupPassword(suPassword, suPasswordErr); });
  suPassword.addEventListener('input', function(){ if (suPassword.classList.contains('invalid')) validateSignupPassword(suPassword, suPasswordErr); });

  function submitSignup(e){
    if (e) e.preventDefault();
    suBanner.classList.remove('show');

    // Client Verification: check for empty fields, invalid email, and weak password
    var okEmail = validateEmail(suEmail, suEmailErr);
    var okUsername = validateUsername(suUsername, suUsernameErr);
    var okPassword = validateSignupPassword(suPassword, suPasswordErr);
    if (!(okEmail && okUsername && okPassword)){
      showBanner(suBanner, 'Bump found a few issues below.', 'error');
      return;
    }

    var emailVal = suEmail.value.trim();
    var usernameVal = suUsername.value.trim();
    var passwordVal = suPassword.value;

    suSubmitBtn.disabled = true;

    // The server will still check for empty fields (400)
    // The server will check for duplicate usernames (409)
    // The server will check for weak passwords (400)
    fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailVal, username: usernameVal, password: passwordVal })
    })
      .then(function(response){
        return response.json().then(function(data){ return { status: response.status, data: data }; });
      })
      .then(function(result){
        if (result.status === 201){
          showBanner(suBanner, 'Account created!', 'success');
          setTimeout(function(){
            window.location.href = 'home.html?user=' + encodeURIComponent(usernameVal) + '&action=' + encodeURIComponent('Account created for');
          }, 500);
          return;
        }
        if (result.status === 409){
          setError(suUsername, suUsernameErr, result.data.message || 'That username is already taken.');
          showBanner(suBanner, result.data.message || 'That username is already taken.', 'error');
        } else if (result.status === 400){
          showBanner(suBanner, result.data.message || 'Please fill in every field.', 'error');
        } else {
          showBanner(suBanner, result.data.message || 'Something went wrong. Try again.', 'error');
        }
        suSubmitBtn.disabled = false;
      })
      .catch(function(){
        showBanner(suBanner, 'Network error. Is the server running?', 'error');
        suSubmitBtn.disabled = false;
      });
  }
  suForm.addEventListener('submit', submitSignup);
  suSubmitBtn.addEventListener('click', submitSignup);

  // Sign In 
  var siForm = document.getElementById('signin-form');
  var siUsername = document.getElementById('si-username');
  var siPassword = document.getElementById('si-password');
  var siUsernameErr = document.getElementById('si-username-error');
  var siPasswordErr = document.getElementById('si-password-error');
  var siBanner = document.getElementById('signin-banner');
  var siSubmitBtn = document.getElementById('signin-submit');

  siUsername.addEventListener('blur', function(){ validateRequired(siUsername, siUsernameErr, 'Username'); });
  siUsername.addEventListener('input', function(){ if (siUsername.classList.contains('invalid')) validateRequired(siUsername, siUsernameErr, 'Username'); });
  siPassword.addEventListener('blur', function(){ validateRequired(siPassword, siPasswordErr, 'Password'); });
  siPassword.addEventListener('input', function(){ if (siPassword.classList.contains('invalid')) validateRequired(siPassword, siPasswordErr, 'Password'); });

  function submitSignin(e){
    if (e) e.preventDefault();
    siBanner.classList.remove('show');

    var okUsername = validateRequired(siUsername, siUsernameErr, 'Username');
    var okPassword = validateRequired(siPassword, siPasswordErr, 'Password');
    if (!(okUsername && okPassword)){
      showBanner(siBanner, 'Bump found a few issues below.', 'error');
      return;
    }

    var usernameVal = siUsername.value.trim();
    var passwordVal = siPassword.value;

    siSubmitBtn.disabled = true;

    // The server will check for empty fields (400)
    // The server will check for non-existent usernames (404)
    // The server will check for incorrect passwords (401)
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameVal, password: passwordVal })
    })
      .then(function(response){
        return response.json().then(function(data){ return { status: response.status, data: data }; });
      })
      .then(function(result){
        if (result.status === 200){
          showBanner(siBanner, 'Signed in!', 'success');
          setTimeout(function(){
            window.location.href = 'home.html?user=' + encodeURIComponent(usernameVal) + '&action=' + encodeURIComponent('Signed in as');
          }, 500);
          return;
        }
        if (result.status === 400){
          showBanner(siBanner, result.data.message || 'Please fill in every field.', 'error');
        } else if (result.status === 404){
          setError(siUsername, siUsernameErr, result.data.message || 'No account with that username.');
          showBanner(siBanner, result.data.message || 'No account found.', 'error');
        } else if (result.status === 401){
          setError(siPassword, siPasswordErr, result.data.message || 'Incorrect password.');
          showBanner(siBanner, result.data.message || 'Incorrect password.', 'error');
        } else {
          showBanner(siBanner, result.data.message || 'Something went wrong. Try again.', 'error');
        }
        siSubmitBtn.disabled = false;
      })
      .catch(function(){
        showBanner(siBanner, 'Network error. Is the server running?', 'error');
        siSubmitBtn.disabled = false;
      });
  }
  siForm.addEventListener('submit', submitSignin);
  siSubmitBtn.addEventListener('click', submitSignin);

})();
