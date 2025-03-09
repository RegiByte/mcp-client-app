import path from "path";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  readJsonFile,
  writeJsonFile,
  updateJsonFile,
} from "../../../core/utils/json-file-utils";
import {
  McpServerSchema,
  McpServerRegistrySchema,
} from "../../../core/validation/mcp-servers-schema";
import * as vaultManager from "../../vault/main/vault-manager";
import * as windowVaultManager from "../../vault/main/window-vault-manager";
import { BrowserWindow } from "electron";

/**
 * Gets the path to the MCP servers registry for a specific vault
 * @param vaultPath The path to the vault
 * @returns The path to the MCP servers registry file
 */
export function getMcpServersRegistryPath(vaultPath: string): string {
  return path.join(vaultPath, ".vault", "mcp-servers-registry.json");
}

/**
 * Gets the active vault for the current window
 * @param windowId The ID of the window (optional, will use first vault if not provided)
 * @returns The active vault or the first vault if none is active
 */
async function getActiveVault(windowId?: number) {
  const vaults = await vaultManager.getVaults();
  
  if (vaults.length === 0) {
    throw new Error("No vaults found");
  }
  
  if (windowId) {
    // Try to get the active vault for this window
    const activeVault = windowVaultManager.getActiveVaultForWindow(windowId, vaults);
    if (activeVault) {
      return activeVault;
    }
  }
  
  // Fallback to first vault if no active vault is set for this window
  return vaults[0];
}

/**
 * Gets all MCP servers registered for the active vault of the specified window
 * @param windowId The ID of the window making the request (optional)
 * @returns Record of server ID to server object
 */
export async function getMcpServers(windowId?: number): Promise<
  Record<string, z.infer<typeof McpServerSchema>>
> {
  try {
    // Get active vault for this window
    const activeVault = await getActiveVault(windowId);
    
    // Read the MCP servers registry from the vault
    const registryPath = getMcpServersRegistryPath(activeVault.path);
    const registry = await readJsonFile(
      registryPath,
      McpServerRegistrySchema,
      { servers: {} }
    );
    
    return registry.servers;
  } catch (error) {
    console.error("Failed to get MCP servers:", error);
    return {};
  }
}

/**
 * Adds a new MCP server to the registry for the active vault
 * @param server The server to add
 * @param windowId The ID of the window making the request (optional)
 */
export async function addMcpServer(
  server: z.infer<typeof McpServerSchema>,
  windowId?: number
): Promise<boolean> {
  try {
    // Get active vault for this window
    const activeVault = await getActiveVault(windowId);
    
    // Generate a new ID if not provided
    if (!server.id) {
      server.id = uuidv4();
    }
    
    // Get the registry path
    const registryPath = getMcpServersRegistryPath(activeVault.path);
    
    // Update the registry
    await updateJsonFile(
      registryPath,
      (registry) => {
        registry.servers[server.id] = server;
        return registry;
      },
      McpServerRegistrySchema,
      { servers: {} }
    );
    
    return true;
  } catch (error) {
    console.error("Failed to add MCP server:", error);
    return false;
  }
}

/**
 * Updates an existing MCP server in the registry for the active vault
 * @param serverId The ID of the server to update
 * @param server The updated server
 * @param windowId The ID of the window making the request (optional)
 */
export async function updateMcpServer(
  serverId: string,
  server: z.infer<typeof McpServerSchema>,
  windowId?: number
): Promise<boolean> {
  try {
    // Get active vault for this window
    const activeVault = await getActiveVault(windowId);
    
    // Ensure the ID is set correctly
    server.id = serverId;
    
    // Get the registry path
    const registryPath = getMcpServersRegistryPath(activeVault.path);
    
    // Update the registry
    await updateJsonFile(
      registryPath,
      (registry) => {
        // Check if the server exists
        if (!registry.servers[serverId]) {
          throw new Error(`Server with ID ${serverId} not found`);
        }
        
        registry.servers[serverId] = server;
        return registry;
      },
      McpServerRegistrySchema,
      { servers: {} }
    );
    
    return true;
  } catch (error) {
    console.error("Failed to update MCP server:", error);
    return false;
  }
}

/**
 * Removes an MCP server from the registry for the active vault
 * @param serverId The ID of the server to remove
 * @param windowId The ID of the window making the request (optional)
 */
export async function removeMcpServer(
  serverId: string,
  windowId?: number
): Promise<boolean> {
  try {
    // Get active vault for this window
    const activeVault = await getActiveVault(windowId);
    
    // Get the registry path
    const registryPath = getMcpServersRegistryPath(activeVault.path);
    
    // Update the registry
    await updateJsonFile(
      registryPath,
      (registry) => {
        // Check if the server exists
        if (!registry.servers[serverId]) {
          throw new Error(`Server with ID ${serverId} not found`);
        }
        
        // Remove the server
        delete registry.servers[serverId];
        return registry;
      },
      McpServerRegistrySchema,
      { servers: {} }
    );
    
    return true;
  } catch (error) {
    console.error("Failed to remove MCP server:", error);
    return false;
  }
}
