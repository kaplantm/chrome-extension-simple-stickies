module.exports = {
  filenameHashing: false, // https://github.com/adambullmer/vue-cli-plugin-browser-extension/issues/87#issuecomment-665663558
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup',
    },
    options: {
      template: 'public/browser-extension.html',
      entry: './src/options/main.js',
      title: 'Options',
    },
    standalone: {
      template: 'public/browser-extension.html',
      entry: './src/standalone/main.js',
      title: 'Standalone',
      filename: 'index.html',
    },
  },
  pluginOptions: {
    browserExtension: {
      manifestTransformer: (manifest) => {
        if (process.env.NODE_ENV === 'development') {
          manifest.content_scripts[1].css.pop();
        }
        return manifest;
      },
      componentOptions: {
        background: {
          entry: 'src/background.js',
        },
        contentScripts: {
          entries: {
            'content-script': ['src/content-scripts/index.js'],
          },
        },
      },
    },
  },
};
