import React from 'react';
import NextLink from 'next/link';
import { Box, Link } from '@chakra-ui/react';

import { Table, Tr, Th, Td } from './Table';
import { Site } from 'interfaces/Site';

const SiteTable = ({ sites }: { sites: Site[] }): React.ReactElement => {
  return (
    <Table w="full">
      <thead>
        <Tr>
          <Th>Name</Th>
          <Th>Site Link</Th>
          <Th>Feedback Link</Th>
          <Th>Date Added</Th>
        </Tr>
      </thead>
      <tbody>
        {sites.map((site, index) => (
          <Box as="tr" key={index}>
            <Td>
              <NextLink href="/site/[siteId]" as={`/site/${index}`} passHref>
                <Link id={`site-table-link-${index}`} fontWeight="medium">
                  {site.name}
                </Link>
              </NextLink>
            </Td>
            <Td>
              <Link href={site.link} isExternal>
                {site.link}
              </Link>
            </Td>
            <Td>
              <NextLink href="/p/[siteId]" as={`/p/${site.id}`} passHref>
                <Link color="blue.500" fontWeight="medium">
                  View Feedback
                </Link>
              </NextLink>
            </Td>
            <Td>{site.createdAt}</Td>
          </Box>
        ))}
      </tbody>
    </Table>
  );
};

export default SiteTable;
