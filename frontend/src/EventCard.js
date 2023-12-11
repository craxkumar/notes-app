import React from "react";
import { Box, Text } from "@chakra-ui/react";

const EventCard = ({ event, onCardClick }) => {
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
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      p={4}
      onClick={() => onCardClick(event)}
      cursor="pointer"
      transition="box-shadow 0.3s ease"
      _hover={{ boxShadow: "md" }}
    >
      <Text fontWeight="bold" fontSize="lg" mb={2}>
        {event.title}
      </Text>
      <Box>
        <Text fontSize="sm" color="gray.500" mb={1}>
          Date: {formattedDate}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Time: {formattedTime}
        </Text>
      </Box>
    </Box>
  );
};

export default EventCard;
