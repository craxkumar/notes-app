import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import ReminderFormModal from "./Modal/ReminderFormModal";

const ReminderPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveReminder = (data) => {
    console.log("Reminder data:", data);
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>Open Reminder Form</Button>
      <ReminderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReminder}
      />
    </div>
  );
};

export default ReminderPage;
