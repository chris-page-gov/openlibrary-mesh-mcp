import assert from 'node:assert/strict';
import { searchOpenLibrary } from '../src/search.mjs';

const endpoint = process.env.MESH_GRAPHQL || 'http://localhost:4000/graphql';

(async () => {
  try {
    const title = 'the lord of the rings';
    const data = await searchOpenLibrary({ endpoint, title, page: 1 });

    assert.ok(typeof data.numFound === 'number', 'numFound should be a number');
    assert.ok(Array.isArray(data.docs), 'docs should be an array');
    if (data.docs.length > 0) {
      const doc = data.docs[0];
      assert.ok(typeof doc.title === 'string', 'doc.title should be a string');
    }

    console.log('[OK] GraphQL Mesh endpoint responded with', data.docs.length, 'docs for', JSON.stringify(title));
  } catch (err) {
    console.error('[FAIL] Test failed:', err.message);
    process.exit(1);
  }
})();