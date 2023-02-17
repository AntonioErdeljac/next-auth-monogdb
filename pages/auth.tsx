import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import type { NextPage } from "next";
import { signIn, getProviders } from "next-auth/react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import Router from "next/router";

const Background = ({ children }: any) => (
  <Box
    display="flex"
    flex="1 1 auto"
    justifyContent="center"
    alignItems="center"
    width="100%"
    height="100vh"
  >
    {children}
  </Box>
);

interface IDivicerProps {
  word?: string;
}

const Divider = ({ word }: IDivicerProps) => {
  return (
    <>
      {word ? (
        <Flex
          w="100%"
          alignItems="center"
          justifyContent="center"
          gap={2}
          mb={4}
        >
          <Box w="100%" border="solid" borderBottom={2} rounded="full"></Box>
          <Text>Or</Text>
          <Box w="100%" border="solid" borderBottom={2} rounded="full"></Box>
        </Flex>
      ) : (
        <Box
          w="100%"
          border="solid"
          borderBottom={2}
          rounded="full"
          mb={6}
        ></Box>
      )}
    </>
  );
};

const Auth: NextPage = ({ providers }: any) => {
  const [authType, setAuthType] = useState("Login");
  const oppAuthType: { [key: string]: string } = {
    Login: "Register",
    Register: "Login",
  };
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const ProvidersButtons = ({ providers }: any) => (
    <Flex direction="column" w="100%">
      {Object.values(providers).map(
        (provider: any) =>
          provider.name !== "Credentials" && (
            <Button
              key={provider.name}
              mb={4}
              bg={"#24292E"}
              color={"white"}
              _hover={{ bg: "#24292E90" }}
              type="submit"
              onClick={() => {
                signIn(provider.id, {
                  callbackUrl: '/',
                });
              }}
            >
              <Box>Sign in with {provider.name}</Box>
            </Button>
          )
      )}
    </Flex>
  );

  const redirectToHome = () => {
    const { pathname } = Router;

    if (pathname === "/auth") {
      Router.push("/");
    }
  };

  const registerUser = async () => {
    try {
    const res = await axios.post('/api/auth/register', {
      email,
      username,
      password
    }, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    await loginUser();
    } catch (error) {
      console.log(error);
    }
  };

  const loginUser = async () => {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: '/'
    });

    redirectToHome();
  };

  const formSubmit = (actions: any) => {
    authType === "Login" ? loginUser() : registerUser();
  };

  return (
    <Background>
      <Box
        w="420px"
        rounded="md"
        bgGradient="linear(to-r, #ffffff80, #ffffff20)"
        p={12}
      >
        <Flex direction="column" justifyContent="center" alignItems="center">
          <Heading size="xl">{authType}</Heading>
          <Text fontSize="sm" mb={6}>
            {authType === "Login"
              ? "Not registered yet? "
              : "Already have an account? "}
            <button onClick={() => setAuthType(oppAuthType[authType])}>
              <Text as="u">{oppAuthType[authType]}</Text>
            </button>
          </Text>

          <Divider />

          <ProvidersButtons providers={providers} />

          <Divider word="Or" />

          <Formik
            initialValues={{}} // { email: "", password: "" }
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(_, actions) => {
              formSubmit(actions);
            }}
          >
            {(props) => (
              <Form style={{ width: "100%" }}>
                <Box display="flex" flexDirection="column" w="100%" mb={4}>
                  {authType === "Register" && (
                    <Field name="username">
                      {() => (
                        <FormControl isRequired mb={6}>
                          <FormLabel htmlFor="username">Username:</FormLabel>
                          <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            background={"blue.600"}
                          />
                        </FormControl>
                      )}
                    </Field>
                  )}
                  <Field name="email">
                    {() => (
                      <FormControl isRequired mb={6}>
                        <FormLabel htmlFor="email">Email:</FormLabel>
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          background={"blue.600"}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {() => (
                      <FormControl isRequired mb={3}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          placeholder="Password"
                          background={"blue.600"}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    mt={6}
                    bg="blue.400"
                    _hover={{ bg: "blue.200" }}
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    {authType}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Flex>
      </Box>
    </Background>
  );
};

export default Auth;

export async function getServerSideProps() {
  return {
    props: {
      providers: await getProviders(),
    },
  };
}