import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { db } from "../../firebase-config/firebase-config";
import { doc, getDoc, onSnapshot, updateDoc } from "@firebase/firestore";
import { useMatch } from "react-router-dom";
import { useUser } from "../../user-context";

const Notes = ({ isOpen, onClose, load }) => {
  const [userMessage, setUserMessage] = useState("");
  const [noteText, setNoteText] = useState(load?.note || "");
  const [chatOpen, setChatOpen] = useState([]);
  const isAdminRoute = useMatch("/admin");
  const { userInfo } = useUser();

  const extractedValue = userInfo.replace(
    /^(.*?)@.*/,
    (match, group) => group.charAt(0).toUpperCase() + group.slice(1)
  );

  const handleUserMessageChange = (event) => {
    setUserMessage(event.target.value);
  };

  const formatTimestamp = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const updateLoadNotes = async (loadId, note) => {
    try {
      const loadDocRef = doc(db, "loads", loadId);
      const loadDocSnapshot = await getDoc(loadDocRef);

      if (loadDocSnapshot.exists()) {
        const loadData = loadDocSnapshot.data();
        const currentNotes = loadData?.note || "";

        const newNote = `${extractedValue} ${formatTimestamp()}: ${note}`;
        const updatedNotes = `${currentNotes}\n${newNote}`;

        await updateDoc(loadDocRef, { note: updatedNotes });

        onSnapshot(loadDocRef, (doc) => {
          const newData = doc.data();
          setNoteText(newData?.note || "");
        });

        setUserMessage("");
      }
    } catch (error) {
      console.error("Error updating load notes:", error);
    }
  };

  const updateReadBy = async (loadId, note) => {
    try {
      const loadDocRef = doc(db, "loads", loadId);
      const loadDocSnapshot = await getDoc(loadDocRef);

      if (loadDocSnapshot.exists()) {
        const loadData = loadDocSnapshot.data();
        const currentReadBy = loadData.readBy || [];

        const userIndex = currentReadBy.findIndex(
          (entry) => entry.userInfo === userInfo
        );

        if (userIndex !== -1) {
          if (currentReadBy[userIndex]) {
            currentReadBy[userIndex].note = note;
          }
        } else {
          currentReadBy.push({ userInfo: userInfo, note: note });
        }

        await updateDoc(loadDocRef, {
          readBy: currentReadBy,
        });

        onSnapshot(loadDocRef, (doc) => {
          const newData = doc.data();
          setChatOpen(newData?.chatOpen || []);
        });
      }
    } catch (error) {
      console.error("Error updating readBy:", error);
    }
  };

  const updateChatOpen = async (loadId) => {
    try {
      const loadDocRef = doc(db, "loads", loadId);
      const loadDocSnapshot = await getDoc(loadDocRef);

      if (loadDocSnapshot.exists()) {
        const chatOpen = loadDocSnapshot.data().chatOpen || [];

        if (Array.isArray(chatOpen) && !chatOpen.includes(userInfo)) {
          chatOpen.push(userInfo);
          await updateDoc(loadDocRef, {
            chatOpen: chatOpen,
          });

          onSnapshot(loadDocRef, (doc) => {
            const newData = doc.data();
            setChatOpen(newData?.chatOpen || []);
          });
        }
      }
    } catch (error) {
      console.error("Error updating chatOpen:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateChatOpen(load?.id);
      updateReadBy(load?.id, noteText);
    }
  }, [isOpen]);

  useEffect(() => {
    setNoteText(load?.note || "");
  }, [load]);

  const handleSaveClick = () => {
    if (userMessage != "") updateLoadNotes(load.id, userMessage);
  };

  const handleTextareaKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSaveClick();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "xl" }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isAdminRoute ? "Notes" : "Enter Notes"}</ModalHeader>
        <ModalCloseButton />

        <>
          <ModalBody>
            <Textarea
              placeholder="Enter your notes here..."
              value={userMessage}
              onChange={handleUserMessageChange}
              onKeyDown={handleTextareaKeyDown}
            />
          </ModalBody>
          <ModalFooter>
            <Flex>
              <Button colorScheme="blue" onClick={onClose} mr={2}>
                Close
              </Button>
              <Button colorScheme="green" onClick={handleSaveClick}>
                Save
              </Button>
            </Flex>
          </ModalFooter>
        </>

        <Flex px={6} pb={6}>
          <Text whiteSpace="pre-line">{noteText}</Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default Notes;
