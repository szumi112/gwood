import React, { useState } from "react";
import { Box, Button, Grid, Input, Select, Text } from "@chakra-ui/react";
import { useLoadContext } from "../load-context";

const AddLoadForm = () => {
  const { addLoad } = useLoadContext();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    status_description: "",
    collection_eta: "",
    collection_company: "",
    collection_zip_code: "",
    ref_mp_po: "",
    ref_ref: "",
    collection_date: "",
    collection_time: "",
    delivery_eta: "",
    delivery_company: "",
    delivery_zip_code: "",
    delivery_date: "",
    delivery_time: "",
    vehicle_type: "",
    rate: "",
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleAddLoad = async () => {
    try {
      const formattedData = {
        ...formData,
        collection_date: formData.collection_date,
        delivery_date: formData.delivery_date,
      };
      addLoad(formattedData);
    } catch (error) {
      console.error("Error adding load:", error);
    }
    setFormData({
      status: "",
      status_description: "",
      collection_eta: "",
      collection_company: "",
      collection_zip_code: "",
      ref_mp_po: "",
      ref_ref: "",
      collection_date: "",
      collection_time: "",
      delivery_eta: "",
      delivery_company: "",
      delivery_zip_code: "",
      delivery_date: "",
      delivery_time: "",
      vehicle_type: "",
      rate: "",
    });
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <>
      <Button onClick={toggleFormVisibility} mb={8} mx={4}>
        {isFormVisible ? "Hide Add a load" : "Add a load"}
      </Button>

      <Box
        mt={4}
        mb={isFormVisible ? 10 : 4}
        p={isFormVisible ? 4 : 0}
        borderWidth={isFormVisible ? "1px" : "0px"}
        borderRadius="md"
        boxShadow="md"
      >
        {isFormVisible && (
          <>
            <Text fontSize="24px" mb={4} fontWeight={"500"}>
              Collection:
            </Text>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(6, 1fr)",
              }}
              gap={6}
              mb={4}
            >
              <Input
                size="md"
                type="text"
                placeholder="Collection Company"
                value={formData?.collection_company}
                onChange={(e) =>
                  handleChange("collection_company", e.target.value)
                }
              />

              <Input
                size="md"
                type="text"
                placeholder="Collection postcode"
                value={formData?.collection_zip_code}
                onChange={(e) =>
                  handleChange("collection_zip_code", e.target.value)
                }
              />

              <Input
                size="md"
                type="text"
                placeholder="Reference (MP/PO)"
                value={formData?.ref_mp_po}
                onChange={(e) => handleChange("ref_mp_po", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="Reference (REF)"
                value={formData?.ref_ref}
                onChange={(e) => handleChange("ref_ref", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="Col. Date DD/MM/YYYY"
                value={formData?.collection_date}
                onChange={(e) =>
                  handleChange("collection_date", e.target.value)
                }
              />

              <Input
                size="md"
                type="text"
                placeholder="Collection Time"
                value={formData?.collection_time}
                onChange={(e) =>
                  handleChange("collection_time", e.target.value)
                }
              />
            </Grid>
            <Text fontSize="24px" mb={4} fontWeight={"500"}>
              Delivery:
            </Text>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(6, 1fr)",
              }}
              gap={6}
              mb={4}
            >
              <Input
                size="md"
                type="text"
                placeholder="Delivery ETA"
                value={formData?.delivery_eta}
                onChange={(e) => handleChange("delivery_eta", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="Delivery Company"
                value={formData?.delivery_company}
                onChange={(e) =>
                  handleChange("delivery_company", e.target.value)
                }
              />

              <Input
                size="md"
                type="text"
                placeholder="Delivery postcode"
                value={formData?.delivery_zip_code}
                onChange={(e) =>
                  handleChange("delivery_zip_code", e.target.value)
                }
              />

              <Input
                size="md"
                type="text"
                placeholder="Delivery PO"
                value={formData?.delivery_po}
                onChange={(e) => handleChange("delivery_po", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="Del. Date DD/MM/YYYY"
                value={formData?.delivery_date}
                onChange={(e) => handleChange("delivery_date", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="Delivery Time"
                value={formData?.delivery_time}
                onChange={(e) => handleChange("delivery_time", e.target.value)}
              />
            </Grid>
            <Text fontSize="24px" mb={4} fontWeight={"500"}>
              Other:
            </Text>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(6, 1fr)",
              }}
              gap={6}
              mb={4}
            >
              <Input
                size="md"
                type="text"
                placeholder="Trailer Type"
                value={formData?.vehicle_type}
                onChange={(e) => handleChange("vehicle_type", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="Rate"
                value={formData?.rate}
                onChange={(e) => handleChange("rate", e.target.value)}
              />
            </Grid>
            <Button onClick={handleAddLoad} mt={8} colorScheme="green">
              Add Load
            </Button>
          </>
        )}
      </Box>
    </>
  );
};

export default AddLoadForm;
