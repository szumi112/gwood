import { Button, Center, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const LoginPlease = () => {
  const navigate = useNavigate();
  return (
    <>
      <Center mt={"20%"}>
        <Flex flexDir={"column"}>
          <Text>You must sign in or register to see the load board</Text>

          <Button onClick={() => navigate("/")} mx="auto" mt={"40px"}>
            Go to login page
          </Button>
        </Flex>
      </Center>
    </>
  );
};

export default LoginPlease;
