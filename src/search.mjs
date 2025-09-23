import fetch from 'cross-fetch';

/**
 * Search OpenLibrary via the Mesh GraphQL endpoint.
 * @param {object} opts
 * @param {string} opts.endpoint - GraphQL endpoint (e.g., http://localhost:4000/graphql)
 * @param {string} opts.title - Search title string
 * @param {number} [opts.page=1] - Page number (1-based)
 * @returns {Promise<object>} GraphQL payload for searchBooks
 */
export async function searchOpenLibrary({ endpoint, title, page = 1 }) {
  if (!endpoint) throw new Error("Missing GraphQL endpoint");
  if (!title || !title.trim()) throw new Error("title is required");

  const query = /* GraphQL */ `
    query($title: String!, $page: Int) {
      searchBooks(title: $title, page: $page) {
        numFound
        start
        docs {
          title
          author_name
          first_publish_year
          key
        }
      }
    }
  `;
  const variables = { title, page };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GraphQL request failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }
  return data.data.searchBooks;
}