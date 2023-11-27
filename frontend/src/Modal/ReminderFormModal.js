import React, { useState, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Flex,
  useToast,
} from "@chakra-ui/react";

const ReminderFormModal = ({ isOpen, onClose, onSave }) => {
  const [reminderData, setReminderData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
  });
  const toast = useToast({
    containerStyle: {
      width: "500px",
      maxWidth: "100%",
    },
  });
  const toastIdRef = useRef();

  const handleSave = () => {
    if (!isValidDateAndTime()) {
      showValidationToast("error", "Please select a future date and time.");
      return;
    }

    if (!isValidTitleAndDescription()) {
      return;
    }

    onSave(reminderData);
    setReminderData({ title: "", date: "", time: "", description: "" });
    showValidationToast("success", "Reminder Added");
    onClose();
  };

  const isValidDateAndTime = () => {
    const selectedDateTime = new Date(
      `${reminderData.date}T${reminderData.time}`
    );
    const currentDateTime = new Date();

    return selectedDateTime > currentDateTime;
  };

  const isValidTitleAndDescription = () => {
    if (!reminderData.title.trim() || !reminderData.description.trim()) {
      showValidationToast("error", "Title and Description cannot be empty.");
      return false;
    }
    return true;
  };

  const showValidationToast = (state, message) => {
    console.log(state, message);
    toast.close(toastIdRef.current);
    toastIdRef.current = toast({
      title: message,
      status: state,
      duration: 5000,
      variant: "left-accent",
      isClosable: true,
    });
  };

  const handleInputChange = (key, value) => {
    setReminderData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="lg" p={4}>
        <ModalHeader textAlign="center">Create Reminder</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column">
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={reminderData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </FormControl>

            <Flex mt={4}>
              <FormControl flex="1" mr={2}>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={reminderData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </FormControl>

              <FormControl flex="1" ml={2}>
                <FormLabel>Time</FormLabel>
                <Input
                  type="time"
                  value={reminderData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                />
              </FormControl>
            </Flex>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={reminderData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReminderFormModal;
