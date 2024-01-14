import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Grid,
} from "@chakra-ui/react";

import "font-awesome/css/font-awesome.min.css";

function FilterComponent({ applyFilters }) {
  const [companyFilter, setCompanyFilter] = useState("");
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loadStatusFilter, setLoadStatusFilter] = useState("All");

  const handleReferenceChange = (e) => {
    const newValue = e.target.value;
    setReference(newValue);
    applyFilters(newValue);
  };

  const handleCompanyChange = (e) => {
    const newValue = e.target.value;
    setCompanyFilter(newValue);
    applyFilters(newValue);
  };

  const handleStatusChange = (e) => {
    const newValue = e.target.value;
    setStatus(newValue);
    applyFilters(newValue);
  };

  const handleStartDateChange = (e) => {
    const newValue = e.target.value;
    setStartDate(newValue);
    applyFilters(newValue);
  };

  const handleEndDateChange = (e) => {
    const newValue = e.target.value;
    setEndDate(newValue);
    applyFilters(startDate);
  };

  const handleLoadStatusChange = (e) => {
    const newValue = e.target.value;
    setLoadStatusFilter(newValue);
    applyFilters(newValue);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    applyFilters(
      companyFilter,
      reference,
      status,
      startDate,
      endDate,

      loadStatusFilter
    );
  }, [companyFilter, reference, status, startDate, endDate, loadStatusFilter]);

  const resetFilters = () => {
    setCompanyFilter("");
    setReference("");
    setStatus("");

    setStartDate("");
    setEndDate("");
    setLoadStatusFilter("All");
  };

  return (
    <>
      {/* <Button onClick={toggleFilters} mb={2} mx={4}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button> */}

      <Box
        mt={4}
        mx={4}
        mb={showFilters ? 10 : 4}
        p={showFilters ? 4 : 0}
        borderWidth={showFilters ? "1px" : "0px"}
        borderRadius="md"
        boxShadow="md"
      >
        {showFilters && (
          <>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
                xl: "repeat(4, 1fr)",
              }}
              gap={6}
              alignItems={"center"}
            >
              <>
                <FormControl>
                  <FormLabel>Reference Number</FormLabel>
                  <Input
                    type="text"
                    placeholder="MP PO or Reference Number"
                    value={reference}
                    onChange={handleReferenceChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Company</FormLabel>
                  <Input
                    type="text"
                    placeholder="Company name"
                    value={companyFilter}
                    onChange={handleCompanyChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    placeholder="Select status"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </Select>
                </FormControl>

                <FormControl mr={2}>
                  <FormLabel>Collection Start Date</FormLabel>

                  <Input
                    placeholder={"DD/MM/YYYY"}
                    type="text"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                </FormControl>

                <FormControl mt={{ base: 4, sm: 0 }}>
                  <FormLabel>Collection End Date</FormLabel>

                  <Input
                    placeholder={"DD/MM/YYYY"}
                    type="text"
                    value={endDate}
                    onChange={handleEndDateChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Load Status</FormLabel>
                  <Select
                    placeholder="Select Load Status"
                    value={loadStatusFilter}
                    onChange={handleLoadStatusChange}
                  >
                    <option value="All">All</option>
                    <option value="Finished">Finished</option>
                    <option value="In progress">In progress</option>
                  </Select>
                </FormControl>
              </>
            </Grid>
            <Button mt={8} colorScheme="cyan" onClick={resetFilters}>
              Reset Filters
            </Button>
          </>
        )}
      </Box>
    </>
  );
}

export default FilterComponent;
