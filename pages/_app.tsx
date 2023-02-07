import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'; 
import {wrapper} from '../lib/store'
import { ReactElement } from 'react';

export default function App ({ Component, ...rest }: AppProps):ReactElement {
  const {store, props} = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Component {...props.pageProps} />
    </Provider>
  )
}
