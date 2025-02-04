/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator } from "@azure/core-paging";
import {
  Table,
  TablesListByWorkspaceOptionalParams,
  TablesUpdateOptionalParams,
  TablesUpdateResponse,
  TablesCreateOptionalParams,
  TablesCreateResponse,
  TablesGetOptionalParams,
  TablesGetResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a Tables. */
export interface Tables {
  /**
   * Gets all the tables for the specified Log Analytics workspace.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the workspace.
   * @param options The options parameters.
   */
  listByWorkspace(
    resourceGroupName: string,
    workspaceName: string,
    options?: TablesListByWorkspaceOptionalParams
  ): PagedAsyncIterableIterator<Table>;
  /**
   * Updates a Log Analytics workspace table properties.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the workspace.
   * @param tableName The name of the table.
   * @param parameters The parameters required to update table properties.
   * @param options The options parameters.
   */
  update(
    resourceGroupName: string,
    workspaceName: string,
    tableName: string,
    parameters: Table,
    options?: TablesUpdateOptionalParams
  ): Promise<TablesUpdateResponse>;
  /**
   * Updates a Log Analytics workspace table properties.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the workspace.
   * @param tableName The name of the table.
   * @param parameters The parameters required to update table properties.
   * @param options The options parameters.
   */
  create(
    resourceGroupName: string,
    workspaceName: string,
    tableName: string,
    parameters: Table,
    options?: TablesCreateOptionalParams
  ): Promise<TablesCreateResponse>;
  /**
   * Gets a Log Analytics workspace table.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the workspace.
   * @param tableName The name of the table.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    workspaceName: string,
    tableName: string,
    options?: TablesGetOptionalParams
  ): Promise<TablesGetResponse>;
}
