import { Site } from 'interfaces/Site';

const dev = process.env.NEXT_PUBLIC_NODE_ENV !== 'production';

export const server = dev
  ? 'http://localhost:9001'
  : 'https://feedback-edaj.vercel.app';

export const fetcher = async (url: string, token: string): Promise<Site[]> => {
  const res = await fetch(`${server}${url}`, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin'
  });

  return res.json();
};
