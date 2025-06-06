import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: 'selector',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // UBA Type Color Classes - ensure dynamic class names are included
    'bg-sky-200',
    'dark:bg-sky-800',
    'text-sky-800',
    'dark:text-sky-200',
    'border-sky-400',
    'dark:border-sky-600',
    'bg-emerald-200',
    'dark:bg-emerald-800',
    'text-emerald-800',
    'dark:text-emerald-200',
    'border-emerald-400',
    'dark:border-emerald-600',
    'bg-teal-200',
    'dark:bg-teal-800',
    'text-teal-800',
    'dark:text-teal-200',
    'border-teal-400',
    'dark:border-teal-600',
    'bg-amber-200',
    'dark:bg-amber-800',
    'text-amber-800',
    'dark:text-amber-200',
    'border-amber-400',
    'dark:border-amber-600',
    'bg-yellow-200',
    'dark:bg-yellow-800',
    'text-yellow-800',
    'dark:text-yellow-200',
    'border-yellow-400',
    'dark:border-yellow-600',
    'bg-rose-200',
    'dark:bg-rose-800',
    'text-rose-800',
    'dark:text-rose-200',
    'border-rose-400',
    'dark:border-rose-600',
    'bg-pink-200',
    'dark:bg-pink-800',
    'text-pink-800',
    'dark:text-pink-200',
    'border-pink-400',
    'dark:border-pink-600',
    'bg-fuchsia-200',
    'dark:bg-fuchsia-800',
    'text-fuchsia-800',
    'dark:text-fuchsia-200',
    'border-fuchsia-400',
    'dark:border-fuchsia-600',
    'bg-indigo-200',
    'dark:bg-indigo-800',
    'text-indigo-800',
    'dark:text-indigo-200',
    'border-indigo-400',
    'dark:border-indigo-600',
    'bg-purple-200',
    'dark:bg-purple-800',
    'text-purple-800',
    'dark:text-purple-200',
    'border-purple-400',
    'dark:border-purple-600',
    'bg-gray-400',
    'dark:bg-gray-600',
    'text-gray-800',
    'dark:text-gray-200',
    'border-gray-500',
    'bg-gray-300',
    'dark:bg-gray-700',
    'text-gray-700',
    'dark:text-gray-300',
    'border-gray-400',
    'bg-slate-200',
    'dark:bg-slate-700',
    'text-slate-700',
    'dark:text-slate-300',
    'border-slate-400',
    'dark:border-slate-500',
    'bg-stone-300',
    'dark:bg-stone-600',
    'text-stone-800',
    'dark:text-stone-200',
    'border-stone-400',
    'dark:border-stone-500',
  ],
  daisyui: {
    themes: false, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: 'dark', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: 'dui-', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },

  theme: {
    extend: {
      spacing: {
        appbar: '4rem',
        icon: '1.5rem',
      },
      colors: {
        red: {
          '50': '#fef3f2',
          '100': '#fce9e7',
          '200': '#f9d3d2',
          '300': '#f4afad',
          '400': '#ed807f',
          '500': '#e25153',
          '600': '#d2414a',
          '700': '#ad232f',
          '800': '#91202d',
          '900': '#7c1f2d',
          '950': '#450c13',
        },
        comment: '#6a9955',
        primary: {
          '50': '#f2f8fd',
          '100': '#e5eff9',
          '200': '#c4ddf3',
          '300': '#90c1e9',
          '400': '#55a1db',
          '500': '#4193d2',
          '600': '#2069a9',
          '700': '#1b5489',
          '800': '#1a4872',
          '900': '#1b3e5f',
          '950': '#12273f',
        },
        secondary: {
          '50': '#fbf6ef',
          '100': '#f2e6d3',
          '200': '#e5caa2',
          '300': '#d7ab72',
          '400': '#cd9352',
          '500': '#c3763c',
          '600': '#ac5c33',
          '700': '#90442d',
          '800': '#76382a',
          '900': '#622f25',
          '950': '#371611',
        },
        base: {
          '50': '#f4f6f7',
          '100': '#e3e8ea',
          '200': '#cad2d7',
          '300': '#a4b2bc',
          '400': '#788b98',
          '500': '#5d707e',
          '600': '#475766',
          '700': '#3e4a56',
          '800': '#364049',
          '900': '#213036',
          '950': '#1c2026',
        },
        lalamove: {
          '50': '#fff7f0',
          '100': '#ffe9d9',
          '200': '#ffc9ad',
          '300': '#ff9e7e',
          '400': '#ff7a5b',
          '500': '#ff671d',
          '600': '#ff5e1a',
          '700': '#ff4f16',
          '800': '#ff3f12',
          '900': '#ff2d0d',
          '950': '#ff0f00',
        },
      },
      dropShadow: (utils) => ({
        'dark-solid': [
          `2px 2px 0 ${utils.theme('colors.base.800')}`,
          `2px -2px 0 ${utils.theme('colors.base.800')}`,
          `-2px -2px 0 ${utils.theme('colors.base.800')}`,
          `-2px 2px 0 ${utils.theme('colors.base.800')}`,
        ],
        'light-solid': [
          `2px 2px 0 ${utils.theme('colors.base.100')}`,
          `2px -2px 0 ${utils.theme('colors.base.100')}`,
          `-2px -2px 0 ${utils.theme('colors.base.100')}`,
          `-2px 2px 0 ${utils.theme('colors.base.100')}`,
        ],
      }),
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('daisyui'),
    plugin(
      function ({ addUtilities, matchUtilities, addBase, theme }) {
        addBase({
          '*, ::before, ::after': {
            '--tw-translate-x': '0',
            '--tw-translate-y': '0',
            '--tw-translate-z': '0',
            '--tw-rotate-x': '0',
            '--tw-rotate-y': '0',
            '--tw-rotate-z': '0',
            '--tw-skew-x': '0',
            '--tw-skew-y': '0',
            '--tw-scale-x': '1',
            '--tw-scale-y': '1',
            '--tw-scale-z': '1',
            // '--tw-self-perspective': '0',
            '--tw-transform': [
              'translateX(var(--tw-translate-x))',
              'translateY(var(--tw-translate-y))',
              'rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z))',
              'translateZ(var(--tw-translate-z))',
              'skewX(var(--tw-skew-x))',
              'skewY(var(--tw-skew-y))',
              'scale3d(var(--tw-scale-x), var(--tw-scale-y), var(--tw-scale-z))',
            ].join(' '),
          },
        });

        addUtilities({
          '.transform-style-flat': {
            'transform-style': 'flat',
          },
          '.transform-style-3d': {
            'transform-style': 'preserve-3d',
          },
        });

        addUtilities({
          '.backface-visible': {
            'backface-visibility': 'visible',
          },
          '.backface-hidden': {
            'backface-visibility': 'hidden',
          },
        });

        matchUtilities(
          {
            'perspective-origin': (v) => ({
              'perspective-origin': v,
            }),
          },
          {
            values: theme('transformOrigin'),
          },
        );

        matchUtilities(
          {
            perspective: (v) => ({
              perspective: v,
            }),
          },
          {
            values: theme('perspectiveValues'),
          },
        );

        addUtilities({
          '.transform-3d-none': { transform: 'none' },
          // '.transform-3d': {
          //     '@defaults transform': {},
          //     transform: 'var(--tw-transform)',
          // }
        });
        matchUtilities(
          {
            'rotate-x': (v) => ({
              '--tw-rotate-x': v,
              transform: 'var(--tw-transform)',
            }),
            'rotate-y': (v) => ({
              '--tw-rotate-y': v,
              transform: 'var(--tw-transform)',
            }),
            'rotate-z': (v) => ({
              '--tw-rotate-z': v,
              transform: 'var(--tw-transform)',
            }),
          },
          {
            values: theme('rotate'),
            supportsNegativeValues: true,
          },
        );
        matchUtilities(
          {
            'translate-x': (v) => ({
              '--tw-translate-x': v,
              transform: 'var(--tw-transform)',
            }),
            'translate-y': (v) => ({
              '--tw-translate-y': v,
              transform: 'var(--tw-transform)',
            }),
            'translate-z': (v) => ({
              '--tw-translate-z': v,
              transform: 'var(--tw-transform)',
            }),
          },
          {
            values: theme('space'),
            supportsNegativeValues: true,
          },
        );

        matchUtilities(
          {
            'scale-x': (v) => ({
              '--tw-scale-x': v,
              transform: 'var(--tw-transform)',
            }),
            'scale-y': (v) => ({
              '--tw-scale-y': v,
              transform: 'var(--tw-transform)',
            }),
            'scale-z': (v) => ({
              '--tw-scale-z': v,
              transform: 'var(--tw-transform)',
            }),
          },
          {
            values: theme('scale'),
            supportsNegativeValues: true,
          },
        );
      },
      {
        theme: {
          perspectiveValues: {
            none: 'none',
            1: '100px',
            2: '200px',
            3: '300px',
            4: '600px',
            5: '500px',
            6: '600px',
            7: '700px',
            8: '800px',
            9: '900px',
            10: '1000px',
            '25vw': '25vw',
            '50vw': '50vw',
            '75w': '75vw',
            '100vw': '100vw',
          },
        },
      },
    ),
  ],
};
export default config;
