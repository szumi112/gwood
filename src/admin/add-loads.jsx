import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Input,
  Select,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useLoadContext } from "../load-context";

const AddLoadForm = () => {
  const { colorMode } = useColorMode();
  const { addLoad } = useLoadContext();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    ref_no: "",
    truck_number: "",
    truck_reg: "",
    collection_date: "",
    loading_time: "",
    delivery_date: "",
    delivery_time: "",
    collection_ref: "",
    pallet_count: "",
    temp: "",
    phyto: "",
    export: "",
    import: "",
    crossing_port: "",
    company_name: "",
    notes: "",
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
        // collection_date: formData.collection_date,
        // delivery_date: formData.delivery_date,
      };
      addLoad(formattedData);
    } catch (error) {
      console.error("Error adding load:", error);
    }
    setFormData({
      status: "",
      ref_no: "",
      truck_number: "",
      truck_reg: "",
      collection_date: "",
      collection_time: "",
      delivery_date: "",
      delivery_time: "",
      collection_ref: "",
      pallet_count: "",
      temp: "",
      phyto: "",
      export: "",
      import: "",
      crossing_port: "",
      company_name: "",
      notes: "",
    });
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <>
      <Button
        onClick={toggleFormVisibility}
        mb={8}
        mx={4}
        colorScheme="red"
        bg={colorMode === "dark" ? "red.400" : "red.400"}
      >
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
            <Text fontSize="24px" mb={4} fontWeight={"500"}></Text>
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
                placeholder="ref_no"
                value={formData?.ref_no}
                onChange={(e) => handleChange("ref_no", e.target.value)}
              />
              <Input
                size="md"
                type="text"
                placeholder="truck_number"
                value={formData?.truck_number}
                onChange={(e) => handleChange("truck_number", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="truck_reg"
                value={formData?.truck_reg}
                onChange={(e) => handleChange("truck_reg", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="loading_date"
                value={formData?.collection_date}
                onChange={(e) =>
                  handleChange("collection_date", e.target.value)
                }
              />

              <Input
                size="md"
                type="text"
                placeholder="loading_time"
                value={formData?.loading_time}
                onChange={(e) => handleChange("loading_time", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="delivery_date DD/MM/YYYY"
                value={formData?.delivery_date}
                onChange={(e) => handleChange("delivery_date", e.target.value)}
              />
            </Grid>
            <Text fontSize="24px" mb={4} fontWeight={"500"}></Text>
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
                placeholder="delivery_time"
                value={formData?.delivery_time}
                onChange={(e) => handleChange("delivery_time", e.target.value)}
              />
              <Input
                size="md"
                type="text"
                placeholder="collection_ref"
                value={formData?.collection_ref}
                onChange={(e) => handleChange("collection_ref", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="pallet_count"
                value={formData?.pallet_count}
                onChange={(e) => handleChange("pallet_count", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="temp"
                value={formData?.temp}
                onChange={(e) => handleChange("temp", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="export"
                value={formData?.export}
                onChange={(e) => handleChange("export", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="import"
                value={formData?.import}
                onChange={(e) => handleChange("import", e.target.value)}
              />
            </Grid>
            <Text fontSize="24px" mb={4} fontWeight={"500"}></Text>
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
                placeholder="company_name"
                value={formData?.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
              />

              <Input
                size="md"
                type="text"
                placeholder="crossing_port"
                value={formData?.crossing_port}
                onChange={(e) => handleChange("crossing_port", e.target.value)}
              />
              {/* <Input
                size="md"
                type="text"
                placeholder="Rate"
                value={formData?.rate}
                onChange={(e) => handleChange("rate", e.target.value)}
              /> */}
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
