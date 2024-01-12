import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  useColorMode,
  IconButton,
  VStack,
  Collapse,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { database } from "../firebase-config/firebase-config";
import { useNavigate } from "react-router-dom";
import { useUser } from "../user-context";
import { useMatch } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import logo from "../assets/kcharles.svg";
import white_phone from "../assets/phone_icon_white.png";
import phone from "../assets/phone_icon.png";
import white_email from "../assets/email_icon_white.png";
import email from "../assets/email_icon.png";
import ColorModeSwitch from "../color-mode/color-mode-switch";
import { useState } from "react";
import LogsModal from "../admin/entry-logs";

const Navigation = () => {
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const { colorMode } = useColorMode();
  const { userInfo } = useUser();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleClick = () => {
    signOut(database).then(navigate("/"));
  };
  const isAdminRoute = useMatch("/admin");

  return (
    <Box
      borderBottom={"1px solid"}
      borderBottomColor={colorMode == "dark" ? "gray.700" : "gray.300"}
      p={4}
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        flexDir={{ base: "column-reverse", md: "row" }}
      >
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          w={{ base: "100%", md: "inherit" }}
          mb={{ base: mobileMenuOpen ? 0 : 4, md: 0 }}
        >
          <Image
            src={logo}
            mt={"25px"}
            mb={"10px"}
            cursor="pointer"
            onClick={() => navigate("/")}
          />
          <IconButton
            aria-label="Open mobile menu"
            icon={<HamburgerIcon />}
            display={{ base: "block", md: "none" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            variant="ghost"
          />
        </Flex>
        {!isAdminRoute && (
          <Flex
            alignItems={"center"}
            my={{ base: 0, md: 0 }}
            flexDir={{ base: "column", sm: "row" }}
          >
            <Flex alignItems={"center"} m={2}>
              <Image
                src={colorMode == "dark" ? white_email : email}
                w="20px"
                h="18px"
                mr={4}
                opacity={"50%"}
              />

              <Text color={colorMode == "dark" ? "gray.300" : "gray.600"}>
                peter@kcharles.co.uk
              </Text>
            </Flex>
            <Flex alignItems={"center"} m={2}>
              <Image
                src={colorMode == "dark" ? white_phone : phone}
                w="20px"
                h="18px"
                mx={4}
                opacity={"50%"}
              />
              <Text color={colorMode == "dark" ? "gray.300" : "gray.600"}>
                + 44 7803 493241
              </Text>
            </Flex>
          </Flex>
        )}
        <Box display={{ base: "none", md: "flex" }}>
          <ColorModeSwitch />
        </Box>
      </Flex>
      <Collapse
        in={mobileMenuOpen}
        animateOpacity
        display={{ base: "block", md: "none" }}
      >
        <VStack
          spacing={4}
          alignItems="center"
          mt={4}
          mb={4}
          pb={4}
          display={{ base: "flex", md: "none" }}
          borderBottom="1px solid"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
        >
          {isAdminRoute && (
            <Text fontSize={"32px"} fontWeight="bold">
              Admin Panel
            </Text>
          )}

          {[
            "test1@test1.com",
            "suzanna.k@kcharles.co.uk",
            "peter@kcharles.co.uk",
            "klaudia@kcharles.co.uk",
            "julia.w@kcharles.co.uk",
          ].includes(userInfo) &&
            !isAdminRoute && (
              <Button
                onClick={() => navigate("/admin")}
                colorScheme="red"
                bg={colorMode === "dark" ? "red.400" : "red.400"}
                w={"100%"}
              >
                Admin Panel
              </Button>
            )}
          {isAdminRoute && (
            <>
              <Button
                onClick={() => navigate("/dashboard")}
                mr={{ base: 0, md: 4 }}
                w={"100%"}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => setIsLogsModalOpen(true)}
                mr={{ base: 0, md: 4 }}
                w={"100%"}
              >
                Logs
              </Button>
            </>
          )}

          <Button onClick={handleClick} w={"100%"}>
            Log out
          </Button>
          <ColorModeSwitch />
        </VStack>
      </Collapse>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        mt={{ base: 0, md: 8 }}
        flexDir={{ base: "column-reverse", md: "row" }}
      >
        {!isAdminRoute ? (
          <Text fontSize={"32px"} fontWeight="bold" my={{ base: 2, md: 0 }}>
            Metaplast Dashboard
          </Text>
        ) : (
          <Text fontSize={"32px"} fontWeight="bold">
            Admin Panel
          </Text>
        )}

        <Flex mb={4} display={{ base: "none", md: "flex" }}>
          {[
            "test1@test1.com",
            "suzanna.k@kcharles.co.uk",
            "peter@kcharles.co.uk",
            "klaudia@kcharles.co.uk",
            "julia.w@kcharles.co.uk",
          ].includes(userInfo) &&
            !isAdminRoute && (
              <Button
                onClick={() => navigate("/admin")}
                mr={8}
                colorScheme="red"
                bg={colorMode === "dark" ? "red.400" : "red.400"}
              >
                Admin Panel
              </Button>
            )}
          {isAdminRoute && (
            <>
              <Button
                onClick={() => navigate("/dashboard")}
                mr={{ base: 0, md: 4 }}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => setIsLogsModalOpen(true)}
                mr={{ base: 0, md: 4 }}
              >
                Logs
              </Button>
            </>
          )}
          <Button onClick={handleClick}>Log out</Button>
        </Flex>
      </Flex>
      <LogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
      />
    </Box>
  );
};

export default Navigation;
