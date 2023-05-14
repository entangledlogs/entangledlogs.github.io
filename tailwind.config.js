module.exports = {
  purge:  {
    enabled: true,
    content: [
      "layouts/**/*.html",
      "themes/thread/layouts/**/*.html",
      "./content/**/*.md",
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    maxHeight: {
      'content' : 'max-height'
    },
    extend: {
      fontFamily: {
        'sans': ['EBGaramond', 'Georgia', 'Helvetica', 'Arial', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            lineHeight: '1.23em',
            fontSize: '1.05em',
            a: {
              color: '#268bd2',
            },
            h1: {
              fontSize: '1.7em',
              marginTop: '0.0em',
              marginBottom: '0.4em',
            },
            h2: {
              fontSize: '1.4em',
              marginTop: '0.8em',
              marginBottom: '0.3em',
              color: theme('colors.green.900')
            },
            h3: {
              fontSize: '1.12em',
              marginTop: '0.5em',
              marginBottom: '0.3em',
              color: theme('colors.blue.900')
            },
            h4: {
              fontSize: '1.12em',
              marginTop: '0.3em',
              marginBottom: '0.3em',
            },
            li: {
              marginTop: '0.2em',
              marginBottom: '0.2em',
            },
            'ul > li::before': {
                content: '""',
                position: 'absolute',
                top: '0.5em',
                backgroundColor: theme('colors.gray.600'),
                borderRadius: '50%',
             },
            ol: {
              marginTop: '0.3em',
              marginBottom: '0.3em',
            },
            ul: {
              marginTop: '0.3em',
              marginBottom: '0.3em',
            },
            p: {
              marginTop: '1.1em',
              marginBottom: '0.3em',
            },
            '> ul > li > *:first-child': {
              marginTop: '0.4em',
            },
            '> ol > li > *:first-child': {
              marginTop: '0.4em',
            },
            table: {
              marginTop: '0.0em',
              marginBottom: '0.0em',
              lineHeight: '1.25em',
            },
            pre: {
              fontSize: '0.75em',
              backgroundColor: '#eee8d5',
              color: '#626C6C',
            }
          },
        },
      }),
      // theme: {
      //   backgroundColor: theme => ({
      //     ...theme('colors'),
      //     'color': '#eee8d5',
      //   })
      // },
    },
  },
  variants: {
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
