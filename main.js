const SwitchTheme = () => {

  var cookie = document.cookie.split('; ').find(row => row.startsWith('night_mode'));

  if (cookie) {

  // Split the cookie into its name and value

      var cookieParts = cookie.split('=');
      var cookieName = cookieParts[0];
      var cookieValue = cookieParts[1];

      // Edit the cookie value depending on current Windows theme.
      // If the current Windows theme is dark, then we set value 1 to night_mode cookie key.
      // If the current Windows theme is white, then we set value 0 to night_mode cookie key.

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

SwitchTheme();