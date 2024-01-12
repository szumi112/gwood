import React, { useState } from "react";
import { Box, Button, FormControl, Input, Select } from "@chakra-ui/react";

function LoadFilters() {
  return (
    <Box
      mb={10}
      display="flex"
      flexDir={{ base: "column", md: "row" }}
      justifyContent="space-between"
    >
      filters
    </Box>
  );
}

export default LoadFilters;
