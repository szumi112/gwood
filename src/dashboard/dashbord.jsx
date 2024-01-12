import { Box } from "@chakra-ui/react";
import Navigation from "./navigation";
import LoadTable from "./load-table";
import OpenChats from "./open-chats";

const Dashboard = () => {
  return (
    <Box>
      <Navigation />
      <LoadTable />
      <OpenChats />
    </Box>
  );
};

export default Dashboard;
