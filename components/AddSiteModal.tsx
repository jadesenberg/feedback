/* eslint-disable no-useless-escape */
import { useForm } from 'react-hook-form';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Box,
  useToast,
  useDisclosure
} from '@chakra-ui/react';
import { DocumentReference, DocumentData } from '@firebase/firestore-types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from 'react-query';

import firebase from 'lib/firebase';
import { createSite } from 'lib/db';
import { useAuth } from 'lib/auth';
import { Site } from 'interfaces/Site';

const URL = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

const schema = yup.object().shape({
  name: yup.string().required('This is a required field!'),
  link: yup
    .string()
    .matches(URL, 'Invalid url format')
    .required('This is a required field!')
});

type SiteForm = {
  link: string;
  name: string;
};

type AddSiteModalProps = {
  children: React.ReactNode;
};

export const AddSiteModal = ({
  children
}: AddSiteModalProps): React.ReactElement => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SiteForm>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const auth = useAuth();
  const queryClient = useQueryClient();

  const onCreate = async (
    siteData: Site
  ): Promise<DocumentReference<DocumentData>> => await createSite(siteData);

  const { mutate } = useMutation(onCreate);

  const onMutateSite = async ({ name, link }: SiteForm): Promise<void> => {
    const siteData = {
      authorId: auth.user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      name,
      link,
      id: ''
    };

    return mutate(siteData, {
      onSuccess: () => {
        onClose();
        toast({
          title: 'Success',
          description: "We've added your site",
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        reset();
        queryClient.invalidateQueries('sites');
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    });
  };

  return (
    <>
      <Button
        background="gray.900"
        color="white"
        fontWeight="medium"
        _hover={{ bg: 'gray.700' }}
        _active={{ bg: 'gray.800', transform: 'scale(0.95)' }}
        onClick={onOpen}
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onMutateSite)}>
          <ModalHeader fontWeight="bold">{`Add Site`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl
              isInvalid={!!errors?.name?.message}
              errortext={errors?.name?.message}
              isRequired
            >
              <FormLabel>{`Name`}</FormLabel>
              <Input
                {...register('name')}
                placeholder="My site"
                form="novalidatedform"
              />
              <Box>
                <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
              </Box>
            </FormControl>

            <FormControl
              isInvalid={!!errors?.link?.message}
              errortext={errors?.link?.message}
              isRequired
              mt={4}
            >
              <FormLabel>{`Link`}</FormLabel>
              <Input
                placeholder="https://website.com"
                {...register('link')}
                form="novalidatedform"
              />
              <Box>
                <FormErrorMessage>{errors?.link?.message}</FormErrorMessage>
              </Box>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>{`Cancel`}</Button>
            <Button colorScheme="teal" type="submit">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
