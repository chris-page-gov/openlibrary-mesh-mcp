#!/usr/bin/env node
// Self-starting test harness for OpenLibrary Mesh MCP
// Spawns the Mesh/MCP server, waits for readiness, runs existing tests, then tears down.

import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import http from 'node:http';

const SERVER_CMD = ['npm', ['run', 'mesh:dev']]; // Adjust if actual script name differs
const GRAPHQL_URL = 'http://localhost:4000/graphql';
const START_TIMEOUT_MS = 25_000;
const POLL_INTERVAL_MS = 750;

function checkReady(url) {
  return new Promise((resolve) => {
    const req = http.request(url, { method: 'POST', timeout: 2000 }, res => {
      // Any HTTP status means socket accepted; we’re up.
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end(JSON.stringify({ query: '{ __typename }' }));
  });
}

async function waitForServer() {
  const start = Date.now();
  while (Date.now() - start < START_TIMEOUT_MS) {
    if (await checkReady(GRAPHQL_URL)) return true;
    await delay(POLL_INTERVAL_MS);
  }
  return false;
}

function spawnServer() {
  const child = spawn(SERVER_CMD[0], SERVER_CMD[1], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env
  });
  child.stdout.on('data', d => {
    const line = d.toString();
    process.stdout.write(`[server] ${line}`);
  });
  child.stderr.on('data', d => {
    const line = d.toString();
    process.stderr.write(`[server:err] ${line}`);
  });
  return child;
}

async function main() {
  console.log('Starting Mesh server...');
  const server = spawnServer();

  let ready = false;
  try {
    ready = await waitForServer();
  } catch (e) {
    console.error('Error while waiting for server:', e);
  }

  if (!ready) {
    console.error(`Server did not become ready within ${START_TIMEOUT_MS}ms`);
    server.kill('SIGINT');
    process.exit(1);
  }

  console.log('Server is ready. Running tests...');

  const testProc = spawn('node', ['test/test.mjs'], {
    stdio: 'inherit',
    env: process.env
  });

  testProc.on('exit', (code, signal) => {
    console.log('Tests finished, shutting down server...');
    // Attempt graceful shutdown
    server.kill('SIGINT');
    // Fallback force kill after a short delay
    setTimeout(() => server.kill('SIGKILL'), 3000);
    if (signal) {
      console.error(`Tests exited via signal ${signal}`);
      process.exit(1);
    }
    process.exit(code ?? 1);
  });

  // If server exits early, abort
  server.on('exit', (code, signal) => {
    if (!ready) {
      console.error(`Server exited before readiness (code=${code}, signal=${signal})`);
      process.exit(1);
    }
  });
}

main().catch(err => {
  console.error('Fatal harness error:', err);
  process.exit(1);
});