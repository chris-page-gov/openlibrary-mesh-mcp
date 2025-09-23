import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { searchOpenLibrary } from '../src/search.mjs';

const GRAPHQL_ENDPOINT = process.env.MESH_GRAPHQL || 'http://localhost:4000/graphql';

const server = new Server(
  { name: 'openlibrary-mesh-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.tool(
  {
    name: 'open-library-search',
    description:
      'Search OpenLibrary books via GraphQL Mesh. Args: title (string, required), page (int, default 1). Returns numFound, start, docs[].',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        page: { type: 'integer', minimum: 1 }
      },
      required: ['title'],
      additionalProperties: false
    }
  },
  async ({ title, page = 1 }) => {
    const result = await searchOpenLibrary({ endpoint: GRAPHQL_ENDPOINT, title, page });
    return {
      content: [
        {
          type: 'json',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
console.error(`[mcp] openlibrary-mesh-mcp ready. Using ${GRAPHQL_ENDPOINT}`);