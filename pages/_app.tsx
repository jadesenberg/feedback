import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Global, css } from '@emotion/react';
import Head from 'next/head';

import { AuthProvider } from 'lib/auth';
import theme from 'styles/thems';

interface appProps {
  Component: React.ElementType;
  pageProps: any;
}

const GlobalStyle = ({ children }): React.ReactElement => {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Global
        styles={css`
          html {
            scroll-behavior: smooth;
          }
          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `}
      />
      {children}
    </>
  );
};

function MyApp({ Component, pageProps }: appProps): React.ReactElement {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} resetCSS>
        <AuthProvider>
          <GlobalStyle>
            <Component {...pageProps} />
          </GlobalStyle>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
