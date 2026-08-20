/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // مستخرجة من ملف فيجما STEP
        navy: '#0b1f66',
        brand: {
          DEFAULT: '#2347e8',
          tint: '#eaeeff',
          wash: '#f0f4ff',
        },
        ink: '#0e1116',
        muted: '#6b7280',
        line: '#e5e9f2',
        surface: '#f5f7fb',
        success: { DEFAULT: '#12b76a', bg: '#ecfdf3' },
        warning: { DEFAULT: '#f59e0b', bg: '#fff9eb' },
        danger: { DEFAULT: '#f04438', bg: '#fef3f2' },
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
        mono: ['"Spline Sans Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': '11px',
        xs: '12px',
        sm: '13px',
        base: '14px',
        md: '15px',
        lg: '16px',
        xl: '20px',
        '2xl': '22px',
        '3xl': '24px',
      },
      borderRadius: {
        badge: '6px',
        ctl: '8px',
        logo: '10px',
        card: '12px',
        panel: '16px',
      },
      boxShadow: {
        card: '0px 4px 6px rgba(31,41,55,0.05)',
        panel: '0px 4px 12px rgba(31,41,55,0.05)',
        modal: '0px 12px 16px rgba(0,0,0,0.15)',
      },
      spacing: {
        sidebar: '260px',
        topbar: '64px',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in .15s ease-out',
        'scale-in': 'scale-in .18s ease-out',
      },
    },
  },
  plugins: [],
}
