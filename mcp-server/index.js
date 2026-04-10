#!/usr/bin/env node

import express from "express";
import { randomUUID } from "node:crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;
const PORT = process.env.PORT || 3001;

if (!STRAPI_TOKEN) {
  console.error("Error: STRAPI_TOKEN environment variable is required");
  process.exit(1);
}

if (!MCP_AUTH_TOKEN) {
  console.error("Error: MCP_AUTH_TOKEN environment variable is required");
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

/**
 * Flattens a nested populate object into URLSearchParams entries.
 * e.g. { Sections: { populate: { problems: true } } }
 * becomes populate[Sections][populate][problems]=true
 */
function flattenPopulate(obj, params, prefix = "populate") {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = `${prefix}[${key}]`;
    if (value === true || value === "*") {
      params.set(fullKey, "*");
    } else if (typeof value === "object" && value !== null) {
      flattenPopulate(value, params, fullKey);
    } else {
      params.set(fullKey, String(value));
    }
  }
}

function applyPopulate(params, populate, populateObject) {
  if (populateObject) {
    flattenPopulate(populateObject, params);
  } else if (populate) {
    if (populate === "*") {
      params.set("populate", "*");
    } else {
      String(populate).split(",").forEach((field, i) => {
        params.set(`populate[${i}]`, field.trim());
      });
    }
  }
}

function createMcpServer() {
  const server = new Server(
    { name: "strapi-lucis-cms", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "list_content_types",
        description:
          "List all available content types (collections) in the Strapi CMS. Use this to discover what collections exist before working with them.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "get_content_type_schema",
        description:
          "Get the full field schema for a Strapi collection, including field types, relations, and components. Always call this before creating or updating entries.",
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
      {
        name: "get_entries",
        description:
          "List entries from a Strapi collection. Supports pagination, filters, locale, and populate to fetch nested components and relations.",
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
            locale: {
              type: "string",
              description: "Locale code to fetch entries in, e.g. 'en', 'fr'. Defaults to default locale.",
            },
            filters: {
              type: "object",
              description: "Strapi filter object, e.g. { title: { $contains: 'hello' } }",
            },
            populate: {
              type: "string",
              description: "What to populate. Use '*' for all top-level relations and components, or a comma-separated list of field names e.g. 'Sections,metadata'.",
            },
            populateObject: {
              type: "object",
              description: "Advanced nested populate for relations inside components/dynamic zones. e.g. { Sections: { populate: { problems: true, biomarkers: true } }, metadata: true }",
            },
          },
          required: ["contentType"],
        },
      },
      {
        name: "get_entry",
        description:
          "Get a single entry from a Strapi collection by its documentId. Supports locale and populate to fetch nested components and relations.",
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
            locale: {
              type: "string",
              description: "Locale code to fetch the entry in, e.g. 'en', 'fr'.",
            },
            populate: {
              type: "string",
              description: "What to populate. Use '*' for all top-level relations and components, or a comma-separated list of field names e.g. 'Sections,metadata'.",
            },
            populateObject: {
              type: "object",
              description: "Advanced nested populate for relations inside components/dynamic zones. e.g. { Sections: { populate: { problems: true, biomarkers: true } }, metadata: true }",
            },
          },
          required: ["contentType", "documentId"],
        },
      },
      {
        name: "create_entry",
        description:
          "Create a new entry in a Strapi collection. Always call get_content_type_schema first to know the correct fields. Returns the created entry with its documentId.",
        inputSchema: {
          type: "object",
          properties: {
            contentType: {
              type: "string",
              description: `The plural API ID of the collection. Available: ${CONTENT_TYPES.join(", ")}`,
            },
            data: {
              type: "object",
              description: "The fields to set on the new entry. Must match the collection's schema.",
            },
            status: {
              type: "string",
              enum: ["draft", "published"],
              description: "Publication status (default: draft)",
            },
            locale: {
              type: "string",
              description: "Locale code for the entry, e.g. 'en', 'fr'.",
            },
          },
          required: ["contentType", "data"],
        },
      },
      {
        name: "update_entry",
        description:
          "Update an existing entry in a Strapi collection by its documentId. Only the fields provided will be updated.",
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
            locale: {
              type: "string",
              description: "Locale of the entry to update, e.g. 'en', 'fr'.",
            },
          },
          required: ["contentType", "documentId", "data"],
        },
      },
      {
        name: "delete_entry",
        description:
          "Permanently delete an entry from a Strapi collection by its documentId. This cannot be undone.",
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
        name: "publish_entry",
        description: "Publish a draft entry, making it publicly visible.",
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
            locale: {
              type: "string",
              description: "Locale of the entry to publish, e.g. 'en', 'fr'.",
            },
          },
          required: ["contentType", "documentId"],
        },
      },
      {
        name: "unpublish_entry",
        description: "Unpublish an entry, reverting it to draft status without deleting it.",
        inputSchema: {
          type: "object",
          properties: {
            contentType: {
              type: "string",
              description: `The plural API ID of the collection. Available: ${CONTENT_TYPES.join(", ")}`,
            },
            documentId: {
              type: "string",
              description: "The documentId of the entry to unpublish",
            },
            locale: {
              type: "string",
              description: "Locale of the entry to unpublish, e.g. 'en', 'fr'.",
            },
          },
          required: ["contentType", "documentId"],
        },
      },
      {
        name: "create_localization",
        description:
          "Create a localized (translated) version of an existing entry. Use this to add a new language version to an entry that already exists in another locale.",
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
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result;

      if (name === "list_content_types") {
        const response = await fetch(
          `${STRAPI_URL}/api/content-type-builder/content-types`,
          { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
        );
        const json = await response.json();
        result = json.data
          ?.filter((ct) => ct.uid?.startsWith("api::"))
          .map((ct) => ({
            uid: ct.uid,
            displayName: ct.schema?.displayName,
            singularName: ct.schema?.singularName,
            pluralName: ct.schema?.pluralName,
            kind: ct.schema?.kind,
          }));

      } else if (name === "get_content_type_schema") {
        const response = await fetch(
          `${STRAPI_URL}/api/content-type-builder/content-types`,
          { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
        );
        const json = await response.json();
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
          kind: match.schema?.kind,
          attributes: match.schema?.attributes,
        };

      } else if (name === "get_entries") {
        const params = new URLSearchParams();
        params.set("pagination[pageSize]", String(args.pageSize || 25));
        params.set("pagination[page]", String(args.page || 1));
        if (args.locale) params.set("locale", String(args.locale));
        if (args.filters) params.set("filters", JSON.stringify(args.filters));
        applyPopulate(params, args.populate, args.populateObject);
        result = await strapiRequest("GET", `/${args.contentType}?${params}`);

      } else if (name === "get_entry") {
        const params = new URLSearchParams();
        if (args.locale) params.set("locale", String(args.locale));
        applyPopulate(params, args.populate, args.populateObject);
        const query = params.toString() ? `?${params}` : "";
        result = await strapiRequest("GET", `/${args.contentType}/${args.documentId}${query}`);

      } else if (name === "create_entry") {
        const data = /** @type {Record<string, unknown>} */ (args.data);
        if (args.status)
          data.publishedAt = args.status === "published" ? new Date().toISOString() : null;
        if (args.locale) data.locale = args.locale;
        result = await strapiRequest("POST", `/${args.contentType}`, { data });

      } else if (name === "update_entry") {
        const params = new URLSearchParams();
        if (args.locale) params.set("locale", String(args.locale));
        const query = params.toString() ? `?${params}` : "";
        result = await strapiRequest(
          "PUT",
          `/${args.contentType}/${args.documentId}${query}`,
          { data: args.data }
        );

      } else if (name === "delete_entry") {
        result = await strapiRequest(
          "DELETE",
          `/${args.contentType}/${args.documentId}`
        );

      } else if (name === "publish_entry") {
        const params = new URLSearchParams();
        if (args.locale) params.set("locale", String(args.locale));
        const query = params.toString() ? `?${params}` : "";
        result = await strapiRequest(
          "PUT",
          `/${args.contentType}/${args.documentId}${query}`,
          { data: { publishedAt: new Date().toISOString() } }
        );

      } else if (name === "unpublish_entry") {
        const params = new URLSearchParams();
        if (args.locale) params.set("locale", String(args.locale));
        const query = params.toString() ? `?${params}` : "";
        result = await strapiRequest(
          "PUT",
          `/${args.contentType}/${args.documentId}${query}`,
          { data: { publishedAt: null } }
        );

      } else if (name === "create_localization") {
        result = await strapiRequest(
          "PUT",
          `/${args.contentType}/${args.documentId}?locale=${args.locale}`,
          { data: args.data }
        );

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

  return server;
}

const sessions = new Map();

const app = express();
app.use(express.json());

app.use("/mcp", (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth || auth !== `Bearer ${MCP_AUTH_TOKEN}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
});

app.all("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];

  let transport;

  if (sessionId && sessions.has(sessionId)) {
    transport = sessions.get(sessionId);
  } else if (!sessionId && req.method === "POST") {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (id) => {
        sessions.set(id, transport);
      },
    });

    transport.onclose = () => {
      if (transport.sessionId) sessions.delete(transport.sessionId);
    };

    const server = createMcpServer();
    await server.connect(transport);
  } else {
    res.status(400).json({ error: "Bad request: missing or invalid session" });
    return;
  }

  await transport.handleRequest(req, res, req.body);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "strapi-lucis-mcp" });
});

app.listen(PORT, () => {
  console.log(`Strapi Lucis MCP server running on port ${PORT}`);
});
