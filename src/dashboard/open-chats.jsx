import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  keyframes,
  useColorMode,
  Flex,
} from "@chakra-ui/react";

import { BsFillChatDotsFill } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { useUser } from "../user-context";
import { db } from "../firebase-config/firebase-config";
import {
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
  collection,
} from "@firebase/firestore";
import Notes from "./modals/notes";
import { useLoadContext } from "../load-context";

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
`;

const buttonAnimation = keyframes`
  0% {
    background-color: rgba(118, 228, 247, 1);
  }
  50% {
    background-color: rgba(104, 182, 232, 1); 
  }
  100% {
    background-color: rgba(118, 228, 247, 1); 
  }
`;

const OpenChats = () => {
  const { userInfo } = useUser();
  const [openChats, setOpenChats] = useState([]);
  const [showChats, setShowChats] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const { colorMode } = useColorMode();
  const { loads } = useLoadContext();

  const openChat = (loadId) => {
    const selectedLoad = loads.find((load) => load.id === loadId);
    if (selectedLoad) {
      setSelectedLoad(selectedLoad);
      setIsNotesModalOpen(true);
    }
  };

  useEffect(() => {
    const messageRef = collection(db, "loads");
    const unsubscribe = onSnapshot(messageRef, (snapshot) => {
      const userOpenChats = [];

      snapshot.forEach((docSnapshot) => {
        const loadData = docSnapshot.data();
        const chatOpen = loadData?.chatOpen || [];

        if (Array.isArray(chatOpen) && chatOpen.includes(userInfo)) {
          userOpenChats.push(docSnapshot.id);
        }
      });

      setOpenChats(userOpenChats);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDeleteChat = async (loadId) => {
    try {
      const loadDocRef = doc(db, "loads", loadId);
      const loadDocSnapshot = await getDoc(loadDocRef);

      if (loadDocSnapshot.exists()) {
        const chatOpen = loadDocSnapshot.data().chatOpen || [];

        const updatedChatOpen = chatOpen.filter((email) => email !== userInfo);

        await updateDoc(loadDocRef, {
          chatOpen: updatedChatOpen,
        });

        setOpenChats((prevChats) => prevChats.filter((id) => id !== loadId));
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const toggleChatList = () => {
    setShowChats(!showChats);
  };

  return (
    <>
      {openChats.length > 0 && (
        <Box
          position="fixed"
          left="10px"
          bottom="10px"
          overflowY="hidden"
          zIndex="999"
          border={showChats ? "1px solid" : "transparent"}
          borderColor={
            showChats
              ? colorMode === "dark"
                ? "#0d1016"
                : "gray.200"
              : "transparent"
          }
          p={1}
          bg={
            showChats
              ? colorMode === "dark"
                ? "#0d1016"
                : "white"
              : "transparent"
          }
          borderRadius="6px"
          width="300px"
          boxShadow={showChats ? "xl" : "none"}
        >
          {showChats && openChats.length > 0 && (
            <Box py={4} borderRadius="6px">
              {openChats.map((loadId) => (
                <Box
                  key={loadId}
                  py="1"
                  display="flex"
                  alignItems="center"
                  backgroundColor={
                    colorMode === "dark" ? "rgba(0, 0, 0, 0.3)" : "gray.50"
                  }
                  m={"1px"}
                  _hover={{
                    backgroundColor:
                      colorMode == "dark"
                        ? "rgba(255, 255, 255, 0.0005)"
                        : "gray.100",
                  }}
                  borderBottom="1px solid"
                  borderColor={
                    colorMode === "dark" ? "rgba(255,255,255,0.1)" : "gray.100"
                  }
                  cursor="pointer"
                >
                  <Flex>
                    <Text
                      mr={2}
                      ml="2"
                      fontSize="14px"
                      onClick={() => openChat(loadId)}
                    >
                      Ref no:
                    </Text>
                    <Text
                      mr={2}
                      ml="2"
                      color={colorMode === "dark" ? "white" : "black"}
                      fontSize="14px"
                      fontWeight="bold"
                      onClick={() => openChat(loadId)}
                    >
                      {
                        loads.find((load) => load.id === loadId)?.formData
                          ?.ref_no
                      }
                    </Text>
                  </Flex>

                  <Box
                    ml="auto"
                    textAlign={"center"}
                    color="red"
                    fontWeight={"700"}
                    onClick={() => handleDeleteChat(loadId)}
                    cursor="pointer"
                    _hover={{
                      backgroundColor:
                        colorMode == "dark"
                          ? "rgba(0,0,0,0.25)"
                          : "rgba(255,0,0,0.10)",
                      boxShadow:
                        colorMode == "dark"
                          ? "0px 0px 3px 1px  rgba(0,0,0,0.85)"
                          : "none",
                      outline: colorMode == "dark" ? "none" : "1px solid",
                      outlineColor:
                        colorMode == "dark" ? "none" : "rgba(255,0,0,0.55)",
                    }}
                    borderRadius={6}
                    mr={"2px"}
                  >
                    <IoIosClose size={20} />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          {openChats.length > 0 && (
            <Box
              p="1"
              display="flex"
              alignItems="center"
              onClick={toggleChatList}
              animation={showChats ? undefined : `${pulse} 3s infinite`}
            >
              <Button
                ml={2}
                size="sm"
                colorScheme="blue"
                animation={
                  showChats ? undefined : `${buttonAnimation} 3s infinite`
                }
              >
                <BsFillChatDotsFill size={24} style={{ marginRight: "10px" }} />
                {showChats ? "Hide" : "Open chats"}
              </Button>
            </Box>
          )}
          <Notes
            isOpen={isNotesModalOpen}
            onClose={() => setIsNotesModalOpen(false)}
            load={selectedLoad}
          />
        </Box>
      )}
    </>
  );
};

export default OpenChats;
