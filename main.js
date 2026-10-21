(() => {
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const readTheme = () => document.cookie.split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith('night_mode='))
    ?.slice('night_mode='.length);

  const switchTheme = () => {
    const theme = colorScheme.matches ? '1' : '0';
    if (readTheme() === theme) return;

    // Match the site's domain cookie and apply it on every route.
    document.cookie = `night_mode=${theme}; Domain=${window.location.hostname}; Path=/; SameSite=Lax`;

    // Blocked cookie writes must not cause an endless reload loop.
    if (readTheme() === theme) window.location.reload();
  };

  colorScheme.addEventListener('change', switchTheme);
  switchTheme();
})();
