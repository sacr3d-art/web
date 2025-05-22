// src/components/Footer.tsx
import React from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <Flex
      width={"100%"}
      bg="white"
      color="#000"
      py={4}
      flexDir={"column"}
      justify={"center"}
      align={"center"}
    >
      <Text fontSize={14}>© 2025 Sacr3d Art. All rights reserved.</Text>
      <Stack direction="row" spacing={6}>
        {/* <Link href="https://www.facebook.com" isExternal>
          <IconButton
            aria-label="Facebook"
            icon={<FaFacebook />}
            bg="transparent"
            _hover={{ bg: "#000", color: "white" }}
            size="lg"
          />
        </Link>
        <Link href="https://www.twitter.com" isExternal>
          <IconButton
            aria-label="Twitter"
            icon={<FaTwitter />}
            bg="transparent"
            _hover={{ bg: "#000", color: "white" }}
            size="lg"
          />
        </Link> */}
        <Link href="https://www.instagram.com/sacr3d.art_/" isExternal>
          <IconButton
            aria-label="Instagram"
            icon={<FaInstagram />}
            bg="transparent"
            _hover={{ bg: "#000", color: "white" }}
            size="lg"
          />
        </Link>
      </Stack>
    </Flex>
  );
};

export default Footer;
