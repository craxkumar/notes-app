import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
} from "@chakra-ui/react";

const EventPopup = ({ isOpen, onClose, event }) => {
  if (!event) {
    return null;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent top="30%">
        <ModalHeader>{event.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Date: {formatDate(event.date)}</Text>{" "}
          <Text>Time: {event.time}</Text>
          <Text>Description: {event.description}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EventPopup;
