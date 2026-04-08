#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error("Error: STRAPI_TOKEN environment variable is required");
  process.exit(1);
}

const CONTENT_TYPES = [
  "about",
  "articles",
  "authors",
  "biomarker-cards",
  "categories",
  "dynamic-pages",
  "global",
  "how-app-works-cards",
  "influencers",
  "problems",
  "testimonial-cards",
  "website-banners",
  "why-sections",
];

async function strapiRequest(method, path, body) {
  const response = await fetch(`${STRAPI_URL}/api${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response (${response.status}): ${text}`);
  }

  if (!response.ok) {
    const msg = data?.error?.message || data?.message || response.statusText;
    throw new Error(`Strapi error (${response.status}): ${msg}`);
  }

  return data;
}

const server = new Server(
  { name: "strapi-lucis-cms", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "create_entry",
      description:
        "Create a new entry in a Strapi collection. Returns the created entry with its documentId.",
      inputSchema: {
        type: "object",
        properties: {
          contentType: {
            type: "string",
            description: `The plural API ID of the collection. Available: ${CONTENT_TYPES.join(", ")}`,
          },
          data: {
            type: "object",
            description:
              "The fields to set on the new entry. Must match the collection's schema.",
          },
          status: {
            type: "string",
            enum: ["draft", "published"],
            description: "Publication status (default: draft)",
          },
        },
        required: ["contentType", "data"],
      },
    },
    {
      name: "update_entry",
      description: "Update an existing entry in a Strapi collection by its documentId.",
      inputSchema: {
        type: "object",
        properties: {
          contentType: {
            type: "string",
            description: `The plural API ID of the collection. Available: ${CONTENT_TYPES.join(", ")}`,
          },
          documentId: {
            type: "string",
            description: "The documentId of the entry to update",
          },
          data: {
            type: "object",
            description: "The fields to update on the entry.",
          },
        },
        required: ["contentType", "documentId", "data"],
      },
    },
    {
      name: "delete_entry",
      description: "Delete an entry from a Strapi collection by its documentId.",
      inputSchema: {
        type: "object",
        properties: {
          contentType: {
            type: "string",
            description: `The plural API ID of the collection. Available: ${CONTENT_TYPES.join(", ")}`,
          },
          documentId: {
            type: "string",
            description: "The documentId of the entry to delete",
          },
        },
        required: ["contentType", "documentId"],
      },
    },
    {
      name: "get_entries",
      description: "List entries from a Strapi collection with optional filters and pagination.",
      inputSchema: {
        type: "object",
        properties: {
          contentType: {
            type: "string",
            description: `The plural API ID of the collection. Available: ${CONTENT_TYPES.join(", ")}`,
          },
          pageSize: {
            type: "number",
            description: "Number of entries to return (default: 25, max: 100)",
          },
          page: {
            type: "number",
            description: "Page number (default: 1)",
          },
          filters: {
            type: "object",
            description:
              "Strapi filter object, e.g. { title: { $contains: 'hello' } }",
          },
        },
        required: ["contentType"],
      },
    },
    {
      name: "get_entry",
      description: "Get a single entry from a Strapi collection by its documentId.",
      inputSchema: {
        type: "object",
        properties: {
          contentType: {
            type: "string",
            description: `The plural API ID of the collection. Available: ${CONTENT_TYPES.join(", ")}`,
          },
          documentId: {
            type: "string",
            description: "The documentId of the entry to fetch",
          },
        },
        required: ["contentType", "documentId"],
      },
    },
    {
      name: "publish_entry",
      description: "Publish a draft entry in a Strapi collection.",
      inputSchema: {
        type: "object",
        properties: {
          contentType: {
            type: "string",
            description: `The plural API ID of the collection. Available: ${CONTENT_TYPES.join(", ")}`,
          },
          documentId: {
            type: "string",
            description: "The documentId of the entry to publish",
          },
        },
        required: ["contentType", "documentId"],
      },
    },
    {
      name: "create_localization",
      description:
        "Create a localized version of an existing entry. Use this to add a translation (e.g. French) to an entry that already exists in another locale.",
      inputSchema: {
        type: "object",
        properties: {
          contentType: {
            type: "string",
            description: `The plural API ID of the collection. Available: ${CONTENT_TYPES.join(", ")}`,
          },
          documentId: {
            type: "string",
            description: "The documentId of the existing entry to localize",
          },
          locale: {
            type: "string",
            description: "The locale code to create, e.g. 'fr', 'de', 'es'",
          },
          data: {
            type: "object",
            description: "The localized field values for this translation",
          },
        },
        required: ["contentType", "documentId", "locale", "data"],
      },
    },
    {
      name: "get_content_type_schema",
      description:
        "Get the field schema for a Strapi collection. Use this before creating or updating entries to know what fields are available and their types.",
      inputSchema: {
        type: "object",
        properties: {
          contentType: {
            type: "string",
            description: `The plural API ID of the collection. Available: ${CONTENT_TYPES.join(", ")}`,
          },
        },
        required: ["contentType"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    if (name === "create_entry") {
      const data = /** @type {Record<string, unknown>} */ (args.data);
      if (args.status) data.publishedAt = args.status === "published" ? new Date().toISOString() : null;
      const body = { data };
      result = await strapiRequest("POST", `/${args.contentType}`, body);
    } else if (name === "update_entry") {
      result = await strapiRequest(
        "PUT",
        `/${args.contentType}/${args.documentId}`,
        { data: args.data }
      );
    } else if (name === "delete_entry") {
      result = await strapiRequest(
        "DELETE",
        `/${args.contentType}/${args.documentId}`
      );
    } else if (name === "get_entries") {
      const params = new URLSearchParams();
      params.set("pagination[pageSize]", String(args.pageSize || 25));
      params.set("pagination[page]", String(args.page || 1));
      if (args.filters) {
        params.set("filters", JSON.stringify(args.filters));
      }
      result = await strapiRequest("GET", `/${args.contentType}?${params}`);
    } else if (name === "get_entry") {
      result = await strapiRequest(
        "GET",
        `/${args.contentType}/${args.documentId}`
      );
    } else if (name === "publish_entry") {
      result = await strapiRequest(
        "PUT",
        `/${args.contentType}/${args.documentId}`,
        { data: { publishedAt: new Date().toISOString() } }
      );
    } else if (name === "create_localization") {
      result = await strapiRequest(
        "PUT",
        `/${args.contentType}/${args.documentId}?locale=${args.locale}`,
        { data: args.data }
      );
    } else if (name === "get_content_type_schema") {
      // Strapi's content-type introspection endpoint
      const response = await fetch(
        `${STRAPI_URL}/api/content-type-builder/content-types`,
        {
          headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
        }
      );
      const json = await response.json();
      // Find the matching content type by its pluralName or uid
      const match = json.data?.find(
        (ct) =>
          ct.schema?.pluralName === args.contentType ||
          ct.uid?.endsWith(`.${args.contentType}`) ||
          ct.schema?.singularName === args.contentType
      );
      if (!match) {
        throw new Error(
          `Content type "${args.contentType}" not found. Available: ${json.data?.map((ct) => ct.schema?.pluralName).join(", ")}`
        );
      }
      result = {
        uid: match.uid,
        singularName: match.schema?.singularName,
        pluralName: match.schema?.pluralName,
        displayName: match.schema?.displayName,
        attributes: match.schema?.attributes,
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            error: "TOOL_ERROR",
            message: error instanceof Error ? error.message : String(error),
          }),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Strapi Lucis CMS MCP server running");
}

main();
