import React, { useState, useEffect, useContext, createContext } from 'react';
//import Router from 'next/router';
import cookie from 'js-cookie';

import firebase from './firebase';
import { firebaseUser } from 'interfaces/types';
import { User } from 'interfaces/User';
import { createUser } from './db';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface UseProvideProps {
  user: User;
  signinWithGitHub: () => Promise<void>;
  signinWithGoogle: () => Promise<void>;
  signout: () => Promise<void | User>;
}

const authContext = createContext<null | UseProvideProps>(null);

export function AuthProvider({
  children
}: AuthProviderProps): React.ReactElement {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = (): UseProvideProps => useContext(authContext);

function useProvideAuth(): UseProvideProps {
  const [user, setUser] = useState<User>(null);
  //const [loading, setLoading] = useState<boolean>(true);

  const handleUser = async (rawUser: firebaseUser): Promise<User> => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      createUser(user.uid, user);
      setUser(user);

      cookie.set('feedback-auth', 'valid', {
        expires: 1
      });

      return user;
    } else {
      setUser(null);
      cookie.remove('feedback-auth');

      return null;
    }
  };
  /*const handleUser = async (rawUser): Promise<User | boolean> => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      const { ...userWithoutToken } = user;

      createUser(user.uid, userWithoutToken);
      setUser(user);

      cookie.set('fast-feedback-auth', true, {
        expires: 1
      });

      setLoading(false);
      return user;
    } else {
      setUser(false);
      cookie.remove('fast-feedback-auth');

      setLoading(false);
      return false;
    }
  };

  const signinWithEmail = (email: string, password: string): Promise<void> => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        handleUser(response.user);
        Router.push('/sites');
      });
  };*/

  const signinWithGitHub = (): Promise<void> => {
    //setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => {
        handleUser(response.user);

        //if (redirect) {
        //  Router.push(redirect);
        //}
      });
  };

  const signinWithGoogle = (): Promise<void> => {
    // setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user);

        /* if (redirect) {
          Router.push(redirect);
        }*/
      });
  };

  const signout = (): Promise<void | User> => {
    // Router.push('/');

    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(null));
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        handleUser(user);
      } else {
        handleUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return {
    user,
    signinWithGitHub,
    signinWithGoogle,
    signout
  };
}

/*
const getStripeRole = async (): Promise<string> => {
  await firebase.auth().currentUser.getIdToken(true);
  const decodedToken = await firebase.auth().currentUser.getIdTokenResult();

  return decodedToken.claims.stripeRole || 'free';
};
*/
//const formatUser = async (user: firebaseUser): UserFormat => {
const formatUser = async (user: firebaseUser): Promise<User> => {
  const token = await user.getIdToken();

  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    token
    /*stripeRole: await getStripeRole(),
    token*/
  };
};
