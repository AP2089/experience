import jsBeautify from 'js-beautify';

const vitePluginHtmlBeautify = (options = {}) => ({
  name: 'vite-plugin-html-beautify',
  transformIndexHtml(html) {
    return jsBeautify.html_beautify(html, options);
  },
});

export default vitePluginHtmlBeautify;