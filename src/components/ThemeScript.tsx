export function ThemeScript() {
  const script = `
    (function() {
      var key = 'smart-bookmark-theme';
      var stored = localStorage.getItem(key);
      var theme = stored === 'light' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
