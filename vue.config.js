module.exports = {
  devServer: {
    port: 9090,
    proxy: {
      '/api': {
        target: 'http://localhost:9000', // Your Express server address
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // Remove the '/api' prefix when forwarding requests
        },
      },
    },
  },
};
