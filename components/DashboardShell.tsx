import React from 'react';
import {
  Flex,
  Stack,
  Link,
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { useAuth } from 'lib/auth';
import { AddSiteModal } from './AddSiteModal';

interface DashboardShellProps {
  children: React.ReactNode;
}

const DashboardShell = ({
  children
}: DashboardShellProps): React.ReactElement => {
  const auth = useAuth();
  return (
    <Flex flexDirection="column" backgroundColor="gray.100" h="100vh">
      <Flex
        backgroundColor="white"
        justifyContent="space-between"
        alignItems="center"
        py={4}
        px={8}
      >
        <Stack spacing={4} isInline alignItems="center">
          <ChatIcon fontSize="24px" />
          <Link display="block" textAlign="left">
            {`Sites`}
          </Link>
          <Link>{`Feedback`}</Link>
        </Stack>
        <Flex alignItems="center">
          {auth?.user && (
            <Link mr={4} onClick={() => auth.signout()}>{`Log Out`}</Link>
          )}
          <Avatar size="sm" src={auth?.user?.photoUrl} />
        </Flex>
      </Flex>
      <Flex
        margin="0 auto"
        direction="column"
        maxW="1250px"
        w="100%"
        px={8}
        mt="50"
      >
        <Breadcrumb>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink color="gray.700" fontSize="sm">
              {`Sites`}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex justifyContent="space-between">
          <Heading color="black" mb={4}>
            {`My Sites`}
          </Heading>
          <AddSiteModal>+ Add Site</AddSiteModal>
        </Flex>
        {children}
      </Flex>
    </Flex>
  );
};

export default DashboardShell;
