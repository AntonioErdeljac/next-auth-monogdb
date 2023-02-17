import NextLink from "next/link";
import { Flex, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Navbar = () => {
  const { pathname } = useRouter();

  const pagesWithoutNavbar = ["/auth"];

  const renderNavbar = !pagesWithoutNavbar.includes(pathname);

  return renderNavbar ? (
    <Flex justifyContent="space-around" p={20}>
      <Button>
        <NextLink href="/">Home</NextLink>
      </Button>
      <Button>
        <NextLink href="/profile">Profile</NextLink>
      </Button>
      <Button>
        <NextLink href="/auth">Auth</NextLink>
      </Button>
    </Flex>
  ) : null;
};

export default Navbar;