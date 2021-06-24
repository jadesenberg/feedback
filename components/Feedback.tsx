import { Box, Divider, Heading, Text } from '@chakra-ui/react';
import { Feedback as FeedbackObj } from 'interfaces/Feedback';

const Feedback = (props: FeedbackObj): React.ReactElement => {
  const { author, text, createdAt } = props;
  return (
    <Box borderRadius={4} maxWidth="700px" w="full">
      <Heading size="sm" as="h3" mb={0}>
        {author}
      </Heading>
      <Text color="gray.500" mb={4} fontSize="xs">
        {createdAt}
      </Text>
      <Text>{text}</Text>
      <Divider
        borderColor="gray.200"
        backgroundColor="gray.100"
        mt={4}
        mb={4}
      />
    </Box>
  );
};

export default Feedback;
