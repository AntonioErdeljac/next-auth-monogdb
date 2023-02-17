import axios from 'axios';
import { useCallback, useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { Box, Button, Divider, Input, VStack } from '@chakra-ui/react';
import { NextPageContext } from 'next';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Auth: React.FC = () => {
  const [variant, setVariant] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const register = useCallback(async () => {
    await axios.post('/api/auth/register', {
      email,
      name,
      password
    });

    signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/'
    })
  }, [email, name, password]);

  const loginContent = (
    <Box>
      <VStack>
        <div>
          <h1>Log in</h1>
        </div>
        <Button onClick={() => signIn('github', { callbackUrl: '/' })}>
          Sign in with Github
        </Button>
        <Button onClick={() => signIn('google', { callbackUrl: '/' })}>
          Sign in with Google
        </Button>
        <Divider />
        <Box>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Box>
        <Button 
          disabled={!email || !password} 
          onClick={() => signIn('credentials', { 
            email, 
            password, 
            redirect: false, 
            callbackUrl: '/' 
          })}>
            Log in
          </Button>
        <small onClick={() => setVariant('register')}>Dont have an account?</small>
      </VStack>
    </Box>
  );

  const registerContent = (
    <Box>
      <VStack>
        <div>
          <h1>Sign Up</h1>
        </div>
        <Box>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Box>
        <Button disabled={!email || !name || !password} onClick={register}>Sign up</Button>
        <small onClick={() => setVariant('login')}>Already have an account?</small>
      </VStack>     
    </Box>
  );


  return (
    <>
      {variant === 'login' && loginContent}
      {variant === 'register' && registerContent}
    </>
  )
}


export default Auth;
