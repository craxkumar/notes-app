import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const brandPrimary = defineStyle({});

export const buttonTheme = defineStyleConfig({
  variants: { brandPrimary },
  defaultProps: {
    size: "lg",
    colorScheme: "blue",
  },
});
