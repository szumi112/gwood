import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Image,
  Text,
  useColorMode,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase-config/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { isValidEmail } from "./modules/email-validation";
import ColorModeSwitch from "../color-mode/color-mode-switch";
import { useUser } from "../user-context";
import logo from "../assets/kcharles.svg";

const LoginSignUp = () => {
  const { userInfo } = useUser();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [userInfo]);

  const toggleForm = () => {
    setShowLoginForm((prev) => !prev);
  };

  const handleSubmit = () => {
    if (!isValidEmail(loginData.email)) {
      setLoginErrorMessage("Invalid email format.");
      return;
    }

    const authAction = showLoginForm
      ? signInWithEmailAndPassword
      : createUserWithEmailAndPassword;

    authAction(database, loginData.email, loginData.password)
      .then((data) => {
        setLoginErrorMessage("");
        // console.log(data, "authData");
        navigate("/dashboard");
      })
      .catch((error) => {
        if (loginData.password.length < 6) {
          setLoginErrorMessage("Password must be at least 6 characters long.");
        } else {
          setLoginErrorMessage(
            showLoginForm
              ? "Email or password incorrect."
              : "Registration failed. Are you sure you don't have an account yet?"
          );
        }
        console.error("Login error:", error);
      });
  };

  const formTitle = showLoginForm
    ? "Login to KCharles Load Board to see your dashboard"
    : "Register to get access to KCharles's Load Board";

  return (
    <>
      <Flex justifyContent="right" my={6} mr={10}>
        <ColorModeSwitch />
      </Flex>

      <Image src={logo} mx="auto" mt={"25px"} mb={"10px"} />
      <Box
        mx="auto"
        mt={{ base: "5%", md: "5%", xl: "3%", "2xl": "5%" }}
        mb={"40px"}
      >
        <VStack
          spacing={4}
          w={{ base: "300px", md: "400px" }}
          mx="auto"
          boxShadow={colorMode === "dark" ? "0px 1px 2px #065666" : "md"}
          px={4}
          py={6}
          textAlign={"center"}
          backgroundColor={colorMode === "dark" ? "gray.900" : "white"}
        >
          <Text mb={4}>{formTitle}</Text>
          <Box w="100%">
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
            </FormControl>
          </Box>

          <Box w="100%">
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />
            </FormControl>
          </Box>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            w="100%"
            mt={4}
          >
            {showLoginForm ? "Login" : "Register"}
          </Button>

          <Text fontSize="sm" color="red.500" mt={2}>
            {loginErrorMessage}
          </Text>

          <Button colorScheme="green" onClick={toggleForm}>
            {showLoginForm ? "Sign Up" : "Sign In"}
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default LoginSignUp;
