import Head from 'next/head';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useAuth } from 'lib/auth';
import { ChatIcon } from '@chakra-ui/icons';

export default function Home(): React.ReactElement {
  const auth = useAuth();
  console.log({ auth });
  return (
    <Flex
      as="main"
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      maxW="400px"
      m="0 auto"
    >
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (document.cookie && document.cookie.includes('feedback-auth')) {
            window.location.href = "/dashboard"
          }
        `
          }}
        />
        <title>Feedback</title>
      </Head>

      <ChatIcon fontSize="64px" />
      <Text mb={2}>
        <Text as="span" fontWeight="bold" display="inline">{`Feedback`}</Text>
        {` is the easiest way to add comments or reviews to your static site`}
      </Text>
      {!auth?.user && (
        <Button mt={2} size="sm" onClick={() => auth.signinWithGitHub()}>
          Sign in
        </Button>
      )}

      {auth?.user && (
        //<Button mt={4} size="sm" onClick={() => auth.signout()}>
        <Button mt={2} size="md">
          <Button as="a" size="sm" fontWeight="medium" href="/dashboard">
            View Dashboard
          </Button>
        </Button>
      )}
    </Flex>
  );
}
