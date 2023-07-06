### Environment Setup
- select Terminal>New Terminal then in terminal enter:<br/>
```
npm install next
npm install react
npm install react-dom
```
- add folders and files<br/>
pages/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;api/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;_app.tsx<br/>
&nbsp;&nbsp;&nbsp;&nbsp;index.tsx<br/>
public/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;assets/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;css/<br/>
components/<br/>
```
root: {
  pages:{
    api:{

    },
    _app.tsx,
    index.tsx
  },
  public:{
    assets:{

    },
    css:{
      styles.css
    }
  }
}
```

- in index.tsx add this
```
import React from 'react'
export default function Main(props){return<>Hellow World!</>}
console.log('Hello World!')
```
- and in _app.tsx add
```
import React from 'react'
import '../public/css/styles.css'

function App(props) {
	const { pageProps, Component } = props
	return <Component {...pageProps} className={'spin'} />
}
export default App

```
- then in terminal enter:
```
npm run dev
```

- create folder: .vscode
- create file: .vscode/settings.json
- add to settings.json:
```
{
    "workbench.colorCustomizations": {
      "titleBar.activeBackground": "#283345",
      "titleBar.activeForeground": "#dcdcdc",
    },
    "prettier.semi": false,
    "prettier.useTabs": true,
    "prettier.singleQuote": true,
    "prettier.tabWidth": 4
}
```

- create file: .vscode/tasks.json
- add to file
```
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run dev on startup",
      "type": "shell",
      "command": "npm run dev",
      "windows": {
        "command": "npm run dev"
      },
      "presentation": {
        "reveal": "never",
        "panel": "new"
      },
      "runOptions": {
        "runOn": "folderOpen"
      }
    }
  ]
}
```
- create file: .gitignore
- add to file
```
##
# Boilerplate from https://github.com/vercel/next.js/blob/master/packages/create-next-app/templates/default/gitignore
# dependencies
/node_modules
/.pnp
.pnp.js
# testing
/coverage
# next.js
/.next/
/out/
# production
/build
# misc
.DS_Store
*.pem
# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
# local env files
.env.local
.env.development.local
.env.test.local
.env.production.local
# vercel
.vercel
##
```


- install swr, react-bootstrap