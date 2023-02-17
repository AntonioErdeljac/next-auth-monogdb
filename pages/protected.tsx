import React from 'react';
import { getSession, useSession } from 'next-auth/react';
import { NextPageContext } from 'next';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Protected: React.FC = () => {
  const { data: session } = useSession();
  return <p>Viewing protected route as {session?.user?.email}</p>
}

export default Protected;
