import { Heading, Text, Flex } from '@chakra-ui/react';
import { AddSiteModal } from './AddSiteModal';

export const EmptyState = (): React.ReactElement => {
  return (
    <Flex
      width="100%"
      backgroundColor="white"
      borderRadius="8px"
      p={16}
      justify="center"
      align="center"
      direction="column"
    >
      <Heading size="lg" mb={2}>
        {`You haven't added any sites.`}
      </Heading>
      <Text mb={4}>{`Welcome, Let's get started`}</Text>
      <AddSiteModal>Add Your First Site</AddSiteModal>
    </Flex>
  );
};
