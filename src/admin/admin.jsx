import React from "react";
import { Box } from "@chakra-ui/react";
import AdminLoads from "./admin-loads-display";
import "./admin.css";
import Navigation from "../dashboard/navigation";
import OpenChats from "../dashboard/open-chats";

const Admin = () => {
  return (
    <Box>
      <Navigation />
      <AdminLoads />
      <OpenChats />
    </Box>
  );
};

export default Admin;
