// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Context, Test } from "mocha";

import {
  env,
  Recorder,
  RecorderStartOptions,
  SanitizerOptions,
  isPlaybackMode,
} from "@azure-tools/test-recorder";

import { CommunicationRelayClient } from "../../../src";
import { parseConnectionString } from "@azure/communication-common";
import { TokenCredential } from "@azure/core-auth";
import { createTestCredential } from "@azure-tools/test-credential";

export interface RecordedClient<T> {
  client: T;
  recorder: Recorder;
}

const envSetupForPlayback: { [k: string]: string } = {
  COMMUNICATION_LIVETEST_DYNAMIC_CONNECTION_STRING: "endpoint=https://endpoint/;accesskey=banana",
  AZURE_CLIENT_ID: "SomeClientId",
  AZURE_CLIENT_SECRET: "azure_client_secret",
  AZURE_TENANT_ID: "12345678-1234-1234-1234-123456789012",
  INCLUDE_PHONENUMBER_LIVE_TESTS: "false",
  COMMUNICATION_ENDPOINT: "https://endpoint/",
  SKIP_INT_IDENTITY_EXCHANGE_TOKEN_TEST: "false",
};

const sanitizerOptions: SanitizerOptions = {
  connectionStringSanitizers: [
    {
      actualConnString: env.COMMUNICATION_LIVETEST_DYNAMIC_CONNECTION_STRING,
      fakeConnString: envSetupForPlayback["COMMUNICATION_LIVETEST_DYNAMIC_CONNECTION_STRING"],
    },
  ],
  uriSanitizers: [
    {
      regex: true,
      target: `(.*)/identities/(?<secret_content>.*?)[/|?](.*)`,
      value: "sanitized",
      groupForReplace: "secret_content",
    },
  ],
  generalSanitizers: [
    { regex: true, target: `"token"\\s?:\\s?"[^"]*"`, value: `"token":"sanitized"` },
    { regex: true, target: `"id"\\s?:\\s?"[^"]*"`, value: `"id":"sanitized"` },
    { regex: true, target: `"username"\\s?:\\s?"[^"]*"`, value: `"username":"sanitized_username"` },
    {
      regex: true,
      target: `"credential"\\s?:\\s?"[^"]*"`,
      value: `"credential":"sanitized_credential"`,
    },
    {
      regex: true,
      target: `[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}`,
      value: `sanitized`,
    },
  ],
  // bodyKeySanitizers: [
  //   { jsonPath: "$.iceServers[*].urls[*]", regex: ".*", value: "turn.skype.com" },
  // ],
};

const recorderOptions: RecorderStartOptions = {
  envSetupForPlayback,
  sanitizerOptions: sanitizerOptions,
};

export async function createRecorder(context: Test | undefined): Promise<Recorder> {
  const recorder = new Recorder(context);
  await recorder.start(recorderOptions);
  await recorder.setMatcher("CustomDefaultMatcher", {
    excludedHeaders: [
      "Accept-Language", // This is env-dependent
      "x-ms-content-sha256", // This is dependent on the current datetime
    ],
  });
  return recorder;
}

export async function createRecordedCommunicationRelayClient(
  context: Context
): Promise<RecordedClient<CommunicationRelayClient>> {
  const recorder = await createRecorder(context.currentTest);

  const client = new CommunicationRelayClient(
    env.COMMUNICATION_LIVETEST_DYNAMIC_CONNECTION_STRING ?? "",
    recorder.configureClientOptions({})
  );

  // casting is a workaround to enable min-max testing
  return {
    client,
    recorder,
  };
}

export async function createRecordedCommunicationRelayClientWithToken(
  context: Context
): Promise<RecordedClient<CommunicationRelayClient>> {
  const recorder = await createRecorder(context.currentTest);

  let credential: TokenCredential;
  const endpoint = parseConnectionString(
    env.COMMUNICATION_LIVETEST_DYNAMIC_CONNECTION_STRING ?? ""
  ).endpoint;
  if (isPlaybackMode()) {
    credential = {
      getToken: async (_scopes: any) => {
        return { token: "testToken", expiresOnTimestamp: 11111 };
      },
    };
  } else {
    credential = createTestCredential();
  }

  const client = new CommunicationRelayClient(
    endpoint,
    credential,
    recorder.configureClientOptions({})
  );

  return { client, recorder };
}
