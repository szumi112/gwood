import React, { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import {
  Box,
  Tr,
  Td,
  Button,
  Flex,
  Input,
  Select,
  Text,
  Image,
  useColorMode,
  Checkbox,
} from "@chakra-ui/react";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";

import { statusColors } from "../../utilities/statusColors";
import Notes from "../modals/notes";
import { db } from "../../firebase-config/firebase-config";
import { doc, onSnapshot, updateDoc } from "@firebase/firestore";

import deleteIcon from "../../assets/delete.png";
import save from "../../assets/save.png";
import edit from "../../assets/edit.png";
import notes from "../../assets/notes.png";
import { useUser } from "../../user-context";

const LoadDataRow = ({
  load,
  onDelete,
  isSelected,
  toggleRowSelection,
  showExportOptions,
}) => {
  const { userInfo } = useUser();
  const { colorMode } = useColorMode();
  const statusColor = statusColors[load?.formData?.status] || "gray.400";
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFormData, setEditedFormData] = useState({ ...load.formData });
  const [isExpanded, setIsExpanded] = useState(false);
  const isAdminRoute = useMatch("/admin");

  const borderBottomColor = !isEditing
    ? colorMode === "dark"
      ? "#222835"
      : "#e1e2e6"
    : "transparent";

  const buttonWidths18px = { base: "18px", xl: "18px" };
  const buttonWidths20px = { base: "21px", xl: "20px" };

  const toggleEditing = () => {
    if (isEditing) {
      const loadDoc = doc(db, "loads", load.id);
      updateDoc(loadDoc, {
        formData: {
          ...editedFormData,
          collection_date: editedFormData.collection_date,
          delivery_date: editedFormData.delivery_date,
        },
      });
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    const loadDocRef = doc(db, "loads", load.id);

    const unsubscribe = onSnapshot(loadDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setEditedFormData(docSnapshot.data().formData);
      }
    });

    return () => unsubscribe();
  }, [load.id]);

  const noteLines = load?.note?.split("\n");
  const noteLinesLen = noteLines?.length - 1;
  const matchingReadBy = load?.readBy?.filter(
    (entry) => entry?.userInfo === userInfo
  );

  const noteLengths =
    matchingReadBy?.map((entry) => entry?.note?.split("\n").length - 1) || [];

  const newNotificationsCount = noteLinesLen - noteLengths;

  const renderField = (field, isEditable = false, placeholder) => {
    const fieldValue = editedFormData[field];

    return isEditing ? (
      <Input
        size="sm"
        type="text"
        placeholder={placeholder}
        value={fieldValue}
        fontSize={{ base: "13px", sm: "11px", "2xl": "12px" }}
        onChange={(e) =>
          setEditedFormData({ ...editedFormData, [field]: e.target.value })
        }
        borderBottomColor={
          isEditing ? (colorMode == "dark" ? "#2a303f" : "#e7e7e8") : "gray"
        }
      />
    ) : (
      <Text>{fieldValue}</Text>
    );
  };

  return (
    <Tr
      mx={{ base: 4, md: "6px", xl: 0 }}
      onClick={() => toggleRowSelection(load.id)}
    >
      <Td
        data-label="Status"
        borderBottom="1px solid"
        borderBottomColor={borderBottomColor}
        display={{
          base: isExpanded ? "auto" : "none",
          "1100px": "table-cell",
        }}
      >
        {isEditing ? (
          <Flex flexDir="column" textAlign="center">
            <Select
              placeholder={"Status step"}
              size="sm"
              className="input-widths"
              fontSize={{ base: "13px", sm: "11px", "2xl": "12px" }}
              value={editedFormData.status}
              onChange={(e) =>
                setEditedFormData({
                  ...editedFormData,
                  status: e.target.value,
                })
              }
              mb={{ base: "4px", xl: 0 }}
            >
              {["1", "2", "3", "4", "Not specified"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Select
              placeholder={"Status description"}
              size="sm"
              fontSize={{ base: "13px", sm: "11px", "2xl": "12px" }}
              value={editedFormData.status_description}
              onChange={(e) =>
                setEditedFormData({
                  ...editedFormData,
                  status_description: e.target.value,
                })
              }
              mb={{ base: "4px", xl: 0 }}
            >
              {[
                "Verification",
                "Confirmed",
                "Collected",
                "Pick Up",
                "In transit",
                "In progress",
                "On hold",
                "Load cancelled",
                "Drop Off",
                "Finished",
                "Something went wrong",
                "Not specified",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Flex>
        ) : (
          <Flex flexDir="column" textAlign="center" pb={{ base: 2, xl: 0 }}>
            <Text
              color={statusColor}
              mb={editedFormData?.status != "Not specified" ? 2 : 0}
              onClick={toggleEditing}
              fontWeight={"500"}
            >
              {editedFormData?.status_description}
            </Text>
            {editedFormData?.status != "Not specified" ? (
              <Flex mx="auto">
                {Array.from({ length: 4 }, (_, i) => (
                  <Box
                    key={i}
                    w="20px"
                    h="5px"
                    bg={
                      i + 1 <= editedFormData?.status ? statusColor : "gray.400"
                    }
                    borderRadius="20%"
                    mr="1px"
                  ></Box>
                ))}
              </Flex>
            ) : (
              <></>
            )}
          </Flex>
        )}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Ref No">
        {renderField("ref_no", true, "Ref no")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Truck#">
        {renderField("truck_number", true, "Truck#")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Truck Reg">
        {renderField("truck_reg", true, "Truck Reg")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Loading date">
        {renderField("collection_date", true, "Loading date")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Time">
        {renderField("collection_time", true, "Time")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Delivery Date">
        {renderField("delivery_date", true, "Delivery Date")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Time">
        {renderField("delivery_time", true, "Time")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Collection Ref">
        {renderField("collection_ref", true, "Collection Ref")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Pallet count">
        {renderField("pallet_count", true, "Pallet count")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Temp">
        {renderField("temp", true, "Temp")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Phyto">
        {renderField("phyto", true, "Phyto")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Export">
        {renderField("export", true, "Export")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Import">
        {renderField("import", true, "Import")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Crossing port">
        {renderField("crossing_port", true, "Crossing port")}
      </Td>
      <Td borderBottomColor={borderBottomColor} data-label="Company name">
        {renderField("company_name", true, "Company name")}
      </Td>

      {/* <Td borderBottomColor={borderBottomColor} data-label="Rate">
        {isEditing ? (
          <Flex flexDir={{ base: "column" }}>
            <Input
              mb={{ base: "4px", xl: 0 }}
              size="sm"
              type="text"
              fontSize={{ base: "13px", sm: "11px", "2xl": "12px" }}
              placeholder={"Rate"}
              value={editedFormData.rate}
              onChange={(e) =>
                setEditedFormData({
                  ...editedFormData,
                  rate: e.target.value,
                })
              }
            />
          </Flex>
        ) : (
          <>
            {" "}
            {editedFormData?.rate?.includes(".")
              ? editedFormData?.rate
              : `${editedFormData?.rate}.00`}
          </>
        )}
      </Td> */}

      <Td
        borderBottomColor={borderBottomColor}
        data-label={isAdminRoute ? "Actions" : "Notes"}
      >
        <Flex
          mt={{ base: "2px", xl: 0 }}
          alignItems={"center"}
          justifyContent={"right"}
        >
          {isAdminRoute && (
            <>
              <Button
                onClick={toggleEditing}
                variant="ghost"
                _hover={{ bg: "none" }}
                className="table-responsive-sizes-text"
                w={buttonWidths18px}
                h={buttonWidths18px}
                p={0}
                mr={{ base: "6px", xl: 0 }}
              >
                <Image
                  src={isEditing ? save : edit}
                  w={buttonWidths18px}
                  h={buttonWidths18px}
                />
              </Button>
              <Button
                onClick={() => onDelete(load?.id)}
                variant="ghost"
                _hover={{ bg: "none" }}
                className="table-responsive-sizes-text"
                w={buttonWidths20px}
                h={buttonWidths20px}
                my={"1px"}
                p={0}
                mx={{ base: "6px", xl: 0 }}
                mr={{ base: 0, "1100px": "auto" }}
              >
                <Image
                  src={deleteIcon}
                  w={buttonWidths20px}
                  h={buttonWidths20px}
                />
              </Button>
            </>
          )}
          <Flex>
            {load?.note || !isAdminRoute ? (
              <Button
                className="table-responsive-sizes-text notesButtonAlign"
                fontWeight="500"
                onClick={() => setIsNotesModalOpen(true)}
                w={buttonWidths18px}
                h={buttonWidths18px}
                p={0}
                variant="ghost"
                _hover={{ bg: "none" }}
                ml={{ base: "6px", xl: 0 }}
                position={"relative"}
                mx={{ base: "auto", xl: "0" }}
              >
                {isNaN(newNotificationsCount) || newNotificationsCount == 0 ? (
                  <></>
                ) : (
                  <Box
                    backgroundColor="red"
                    w="10px"
                    h="12px"
                    position="absolute"
                    top="-8px"
                    borderRadius="9999"
                    fontSize={"10px"}
                    color={"white"}
                  >
                    {newNotificationsCount}
                  </Box>
                )}

                <Image src={notes} w={buttonWidths18px} h={buttonWidths18px} />
              </Button>
            ) : (
              <Box w={{ base: "0px", xl: "40px" }} h="18px"></Box>
            )}
            {showExportOptions && (
              <Checkbox
                as="div"
                ml={3}
                pr={2}
                isChecked={isSelected}
                onChange={() => toggleRowSelection(load.id)}
              ></Checkbox>
            )}
          </Flex>
        </Flex>

        <Notes
          isOpen={isNotesModalOpen}
          onClose={() => setIsNotesModalOpen(false)}
          load={load}
        />
      </Td>
      {/* <Td
        display={{ base: "flex", "1100px": "none" }}
        width="100%"
        mt={{ base: 4, lg: 0 }}
      >
        <Flex
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            px={8}
            colorScheme={isExpanded ? "red" : "green"}
          >
            {isExpanded ? (
              <Flex alignItems={"center"}>
                <Text>Collapse</Text>

                <MdOutlineExpandLess size="24px" />
              </Flex>
            ) : (
              <Flex alignItems={"center"}>
                <Text>Expand</Text> <MdOutlineExpandMore size="24px" />
              </Flex>
            )}
          </Button>
        </Flex>
      </Td> */}
    </Tr>
  );
};

export default LoadDataRow;
