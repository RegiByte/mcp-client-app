import { BrowserWindow } from "electron";
import { AppModule } from "@backend/types";
import { setupRouter, removeRouter } from "./router";

/**
 * Conversations module for the main process
 */
export const ConversationsModule: AppModule = {
  name: "Conversations",

  setupWindow: (_window: BrowserWindow) => {
    // Window-specific setup (if needed)
  },

  cleanupWindow: (_window: BrowserWindow) => {
    // Window-specific cleanup (if needed)
  },

  setupModule: () => {
    setupRouter();
  },

  cleanupModule: () => {
    removeRouter();
  },
};
