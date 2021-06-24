import { Flex, Link } from '@chakra-ui/react';

export default function FeedbackLink({
  siteId
}: {
  siteId: string;
}): React.ReactElement {
  return (
    <Flex justifyContent="space-between" md={8} width="full" mt={1}>
      <Link fontWeight="bold" fontSize="sm" href={`/p/${siteId}`}>
        Leave a comment
      </Link>
      <Link fontSize="xs" color="blackAlpha.500" href={`/`}>
        Powered by Feedback
      </Link>
    </Flex>
  );
}
