import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetStaticProps, GetStaticPaths } from 'next';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react';

import { getAllFeedback, getAllSites } from 'lib/db-admin';
import { Feedback as FeedbackObj } from 'interfaces/Feedback';
import Feedback from 'components/Feedback';
import { useAuth } from 'lib/auth';
import { createFeedback } from 'lib/db';
import firebase from 'lib/firebase';
import format from 'date-fns/format';

const schema = yup.object().shape({
  text: yup.string().required('This is a required field!')
});

export const getStaticProps: GetStaticProps = async (
  context
): Promise<{
  props: { feedback: FeedbackObj[] };
  revalidate;
}> => {
  const siteId = context.params.siteId.toString();
  const feedback = await getAllFeedback(siteId);
  return { props: { feedback }, revalidate: 1 };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sites = await getAllSites();
  const paths = sites.map((site) => ({
    params: {
      siteId: site.id.toString()
    }
  }));
  return {
    paths,
    fallback: false
  };
};

const SiteFeedback = ({
  feedback
}: {
  feedback: FeedbackObj[];
}): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FeedbackObj>({
    resolver: yupResolver(schema)
  });

  const [allFeedback, setAllFeedback] = useState(feedback);

  const onSubmit = async ({ text }): Promise<void> => {
    const newFeedback = {
      author: auth.user.name,
      authorId: auth.user.uid,
      siteId: router.query.siteId.toString(),
      text,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      provider: auth.user.provider,
      status: 'pending',
      rating: 5,
      id: ''
    };

    await createFeedback(newFeedback)
      .then(() => {
        toast({
          title: 'Success',
          description: 'Comment Added',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        const newData = JSON.parse(JSON.stringify(newFeedback));
        newData.createdAt = format(
          newFeedback.createdAt.toDate(),
          'MMM d yyyy'
        );
        setAllFeedback([newData, ...allFeedback]);
        reset();
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error,
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      });
  };

  return (
    <Box display="flex" flexDirection="column" w="full" maxW="700px" m="0 auto">
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          my={8}
          isInvalid={!!errors?.text?.message}
          errortext={errors?.text?.message}
          isRequired
        >
          <FormLabel htmlFor="comment">{`Comment`}</FormLabel>
          <Input
            id="comment"
            type="comment"
            {...register('text')}
            form="novalidatedform"
          />
          <Box>
            <FormErrorMessage>{errors?.text?.message}</FormErrorMessage>
          </Box>
          <Button
            fontWeight="medium"
            type="submit"
            mt={2}
          >{`Add Comment`}</Button>
        </FormControl>
      </Box>

      {allFeedback.map((data) => (
        <Feedback key={data.id} {...data} />
      ))}
    </Box>
  );
};

export default SiteFeedback;
