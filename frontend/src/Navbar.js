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
import { useAuth } from "react-oidc-context";

const Header = ({ socket, schedules }) => {
  const location = useLocation();
  const auth = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(auth);
  const userData = {
    name: auth?.user?.profile?.name,
    email: auth?.user?.profile?.email,
    userId: auth?.user?.profile?.sub,
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const onSave = (data) => {
    // socket.emit("newEvent", data);
    console.log("Reminder data:", data);
    console.log(auth?.user?.access_token);
    fetch(process.env.REACT_APP_API_BASE_URL + "/api/reminders", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth.isAuthenticated
          ? `Bearer ${auth?.user?.access_token}`
          : undefined,
      },
      body: JSON.stringify(data),
    })
      .then((result) => {
        console.log("hiii");
      })
      .catch((error) => console.error(error));
  };

  if (auth.isLoading) {
    return <></>;
  }

  let isloggedIn;
  if (auth.isAuthenticated) {
    window.history.replaceState({}, document.title, window.location.pathname);
    isloggedIn = auth.isAuthenticated;
  }

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

          {isloggedIn && (
            <>
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
                  fontWeight={
                    location.pathname === "/profile" ? "bold" : "normal"
                  }
                  mr={4}
                >
                  Profile
                </Text>
              </Link>
            </>
          )}
        </Flex>

        <Flex alignItems="center">
          {isloggedIn ? (
            <>
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
                        {/* <Text color="gray.500">ID: {userData.userId}</Text> */}
                      </Box>
                    </Flex>
                    <Button
                      as={Link}
                      to="/logout"
                      onClick={() => {
                        auth.signoutRedirect({
                          post_logout_redirect_uri: "http://localhost:3000/",
                        });
                      }}
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
            </>
          ) : (
            <Button
              colorScheme="blue"
              size="sm"
              mr={4}
              onClick={() => auth.signinRedirect()}
            >
              Sign In
            </Button>
          )}
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
