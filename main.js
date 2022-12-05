const SwitchModes = () => {

  var cookie = document.cookie.split('; ').find(row => row.startsWith('night_mode'));

  if (cookie) {

  // Split the cookie into its name and value

      var cookieParts = cookie.split('=');
      var cookieName = cookieParts[0];
      var cookieValue = cookieParts[1];

      // Edit the cookie value

      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          cookieValue = 1;
          console.log("Dark mode enabled.")
        } else {
          cookieValue = 0;
          console.log('White mode enabled.')
        }

      // Set the cookie with the edited value

      document.cookie = cookieName + '=' + cookieValue;
}}

SwitchModes();