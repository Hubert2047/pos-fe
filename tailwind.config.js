module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
   theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
      },
    },
  },
  plugins: [],
};