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
    return <></>;
  }

  const formatDateTime = (dateTimeString) => {
    const eventDate = new Date(dateTimeString);

    if (isNaN(eventDate.getTime())) {
      return { formattedDate: "Invalid Date", formattedTime: "Invalid Time" };
    }

    const localEventDate = new Date(
      eventDate.toLocaleString("en-US", { timeZone: "UTC" })
    );

    const formattedDate = localEventDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = localEventDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = formatDateTime(event.date);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent top="30%">
        <ModalHeader>{event.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Date: {formattedDate}</Text>
          <Text>Time: {formattedTime}</Text>
          <Text>Description: {event.description}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EventPopup;
