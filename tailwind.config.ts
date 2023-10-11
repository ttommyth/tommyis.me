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
        'red':{
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
        'comment': '#6a9955',
        'primary': {
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
        "secondary": {
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
        'base': {
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
        }
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
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
