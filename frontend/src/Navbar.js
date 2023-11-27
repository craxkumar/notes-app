import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom";
import ReminderFormModal from "./Modal/ReminderFormModal";

const Header = ({ socket, schedules }) => {
  const location = useLocation();
  const [userData, setUserData] = useState({
    name: "Dummy",
    email: "dummy@sample.com",
    userId: "abc345",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const onSave = (data) => {
    socket.emit("newEvent", data);
    console.log("Reminder data:", data);
  };

  return (
    <Box bg="#000" py={4} px={6} shadow="md">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        maxW="7xl"
        mx="auto"
      >
        <Flex alignItems="center">
          <Text fontSize="lg" fontWeight="bold" color="#ffffff" mr={4}>
            Reminder App
          </Text>

          <Link to={{ pathname: "/dashboard" }}>
            <Text
              fontSize="md"
              color="#ffffff"
              fontWeight={
                location.pathname === "/dashboard" ? "bold" : "normal"
              }
              mr={4}
            >
              Dashboard
            </Text>
          </Link>

          <Link to="/profile">
            <Text
              fontSize="md"
              color="#ffffff"
              fontWeight={location.pathname === "/profile" ? "bold" : "normal"}
              mr={4}
            >
              Profile
            </Text>
          </Link>
        </Flex>

        <Flex alignItems="center">
          <Button colorScheme="blue" size="sm" mr={4} onClick={openModal}>
            + Create New Reminder
          </Button>

          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Avatar size="sm" />
            </PopoverTrigger>
            <PopoverContent width="300px">
              <PopoverArrow />
              <PopoverBody>
                <Flex alignItems="center">
                  <Avatar size="md" />
                  <Box ml={3}>
                    <Text fontWeight="bold">{userData.name}</Text>
                    <Text color="gray.500">{userData.email}</Text>
                    <Text color="gray.500">ID: {userData.userId}</Text>
                  </Box>
                </Flex>
                <Button
                  as={Link}
                  to="/logout"
                  onClick={() => console.log("Logout clicked")}
                  colorScheme="red"
                  size="sm"
                  mt={2}
                  width="100%"
                >
                  Sign Out
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      </Flex>

      <ReminderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSave}
      />
    </Box>
  );
};

export default Header;
