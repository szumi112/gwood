import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  Box,
  Flex,
} from "@chakra-ui/react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebase-config/firebase-config";

import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";

const LogsModal = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const usersColRef = collection(db, "users");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersColRef);
      setUsers(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          isLogsVisible: false,
        }))
      );
    };
    getUsers();
  }, []);

  const toggleLogsVisibility = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, isLogsVisible: !user.isLogsVisible }
          : user
      )
    );
  };

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Logs</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            {users.map((user) => {
              return (
                <Box key={user.id} my={4}>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      toggleLogsVisibility(user.id);
                    }}
                  >
                    {user.email}{" "}
                    {user.isLogsVisible ? (
                      <MdOutlineExpandLess />
                    ) : (
                      <MdOutlineExpandMore />
                    )}
                  </Button>

                  {user.isLogsVisible &&
                    user.logTime
                      .sort((a, b) => new Date(b) - new Date(a))
                      .slice(0, 10)
                      .map((logDate, index) => (
                        <Flex flexDir="column" key={index} my={4}>
                          <Text>{formatDateTime(logDate)}</Text>
                        </Flex>
                      ))}
                </Box>
              );
            })}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LogsModal;
