module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        accent: '#8b5cf6'
      },
      boxShadow: {
        glass: '0 10px 40px rgba(15, 23, 42, 0.25)'
      }
    }
  },
  plugins: []
};
