import React from 'react'
import { SWRConfig } from 'swr'
import jsonFetch from '../lib/,base/jsonFetch'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/css/styles.css'

function App(props) {
	const { pageProps, Component } = props
	return <SWRConfig value={{ fetcher: jsonFetch }}>
				<Component {...pageProps} className={'spin'} />
			</SWRConfig>
}
export default App
