module.exports = {
  devOptions: {
    open: 'none'
  },
  mount: {
    public: '/',
    'src/client': '/dist'
  },
  buildOptions: {
    sourcemap: true,
  },
  plugins: [],
}
