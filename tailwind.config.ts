import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  daisyui: {
    themes: false, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: "dui-", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },

  theme:{
    extend: {
      spacing: {
        'icon': '1.5rem',
      },
      colors: {
        'comment': '#6a9955',
        'primary': {
          100: '#E6FFFA',
          200: '#B2F5EA',
          300: '#81E6D9',
          400: '#4FD1C5',
          500: '#38B2AC',
          600: '#319795',
          700: '#2C7A7B',
          800: '#285E61',
          900: '#234E52',
        },
        "secondary": {
          100: '#F0F4F8',
          200: '#D9E2EC',
          300: '#BCCCDC',
          400: '#9FB3C8',
          500: '#829AB1',
          600: '#627D98',
          700: '#486581',
          800: '#334E68',
          900: '#243B53',
        },
        'base': {
          100: '#F7FAFC',
          200: '#EDF2F7',
          300: '#E2E8F0',
          400: '#CBD5E0',
          500: '#A0AEC0',
          600: '#718096',
          700: '#4A5568',
          800: '#2D3748',
          900: '#1A202C'
        }
      },
    },
  },
  plugins: [
    require("daisyui"),
    plugin(
      function ({  config, addUtilities,matchUtilities,  addBase, theme, e }) {
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
        })
    
        addUtilities({
          '.transform-style-flat': {
            'transform-style': 'flat',
          },
          '.transform-style-3d': {
            'transform-style': 'preserve-3d',
          },
        })
    
        addUtilities({
          '.backface-visible': {
            'backface-visibility': 'visible',
          },
          '.backface-hidden': {
            'backface-visibility': 'hidden',
          },
        })
    
        matchUtilities({
          'perspective-origin':(v)=>({
            'perspective-origin': v
          })
        }, {
          values: theme('transformOrigin')
        })
    
        matchUtilities({
          perspective:(v)=>({
            perspective: v
          })
        }, {
          values: theme('perspectiveValues')
        })
    
        addUtilities({
          '.transform-3d-none': { transform: 'none' },
          // '.transform-3d': {
          //     '@defaults transform': {},
          //     transform: 'var(--tw-transform)',
          // }
        })
        matchUtilities({
          "rotate-x":(v)=>({
            '--tw-rotate-x': v,
            transform: 'var(--tw-transform)',
          }),
          "rotate-y":(v)=>({
            '--tw-rotate-y': v,
            transform: 'var(--tw-transform)',
          }),
          "rotate-z":(v)=>({
            '--tw-rotate-z': v,
            transform: 'var(--tw-transform)',
          })
        }, {
          values: theme('rotate'),
          supportsNegativeValues:true
        })  
        matchUtilities(({
          "translate-x":(v)=>({
            '--tw-translate-x': v,
            transform: 'var(--tw-transform)',
          }),
          "translate-y":(v)=>({
            '--tw-translate-y': v,
            transform: 'var(--tw-transform)',
          }),
          "translate-z":(v)=>({
            '--tw-translate-z': v,
            transform: 'var(--tw-transform)',
          })
        }), {
          values: theme('space'),
          supportsNegativeValues:true
        })
        
        matchUtilities(({
          "scale-x":(v)=>({
            '--tw-scale-x': v,
            transform: 'var(--tw-transform)',
          }),
          "scale-y":(v)=>({
            '--tw-scale-y': v,
            transform: 'var(--tw-transform)',
          }),
          "scale-z":(v)=>({
            '--tw-scale-z': v,
            transform: 'var(--tw-transform)',
          })
        }), {
          values: theme('scale'),
          supportsNegativeValues:true
        })    
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
      }
    )
    
  ],
}
export default config
