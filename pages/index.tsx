import { useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button,  VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const isLoggedIn = useMemo(() => !!session?.user?.email, [session?.user?.email]);

  return (
    <VStack>
      <h1>Home Page - Unprotected</h1>

      {isLoggedIn && (
          <>
            <p>Logged in as {session?.user?.email}</p>
            <Button onClick={() => signOut()}>Logout</Button>
          </>
        )
      }

      {!isLoggedIn && (
        <>
          <p>Not logged in</p>
          <Button onClick={() => router.push('/auth')}>Login</Button>
        </>
      )}
    </VStack>
  )
}


export default Home;
