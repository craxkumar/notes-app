import React from "react";
import { Box, Text } from "@chakra-ui/react";

const EventCard = ({ event, onCardClick }) => {
  return (
    <Box
      border="1px solid #ccc"
      borderRadius="md"
      p={4}
      onClick={() => onCardClick(event)}
      cursor="pointer"
    >
      <Text fontWeight="bold">{event.title}</Text>
      <Text>{event.date}</Text>
      <Text>{event.time}</Text>
    </Box>
  );
};

export default EventCard;
