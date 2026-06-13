# CPU Game MCP Server

MCP server for a blockchain game on EVM (Abstract). Distributed via npm, runs locally via `npx`.

Two wallet modes via `WALLET_MODE` (defaults to `evm`): `evm` (private key in env, SIWE auth — requires `PRIVATE_KEY`) or `agw` (Device Authorization flow). Session state persists to `~/.cpu-game/session.json`.

The target chain is chosen by `NETWORK` (optional, default `ethereum`; one of `ethereum | ethereum_sepolia | base | base_sepolia`) — its chainId is routed locally (`src/config/network.utils.ts`) and contract addresses are loaded from the game API `GET /api/v1/config?network=`. Set `RPC_URL` when sending transactions (e.g. `reveal`); it falls back to the chain's public RPC otherwise.

## Structure

```
src/
├── index.ts          # Entry — bootstraps AppContext, connects stdio
├── server.ts         # McpServer setup, tool registration
├── tools/            # MCP controllers (input → service → output)
├── services/         # Business logic, orchestration
├── wallet/           # WalletManager interface + EVM / AGW impls
├── api/              # ApiClient (HTTP to the game API, JWT bearer + SIWE re-login)
├── session/          # SessionStorage + SessionManager (persist JWT / session keys)
└── config/           # env + constants
```

## Code rules

### Separate types, constants, and helpers from implementation

Class, service, and factory files contain **only** their runtime logic. Everything else lives in its own sibling file:

- `types.ts` — interfaces, type aliases, enums, zod schemas
- `constants.ts` — constants and magic numbers (module-scoped)
- `*.utils.ts` / `*.helpers.ts` — pure helper / utility functions

Global / cross-module constants live in `src/config/constants.ts`.

Example layout:
```
session/
├── types.ts        # SessionStatus, SessionData, ISessionStorage, schemas
├── constants.ts    # SESSION_FILE_MODE, SESSION_DIR_MODE
├── manager.ts      # SessionManager class
├── storage.ts      # SessionStorage class
└── jwt.utils.ts    # decodeJwtPayload(), isJwtExpired() — pure helpers
```

Test helpers (mocks, fixtures) stay inline inside `__tests__/`.

### Nullable over optional

Declare `field: T | null` in interfaces and type aliases. The `no-restricted-syntax` ESLint rule rejects `field?: T`. For external data shapes (JWT payload, third-party responses), add an inline `// eslint-disable-next-line no-restricted-syntax` on the offending line.

For zod schemas, use `.nullable()` instead of `.optional()`. Normalize `undefined` inputs to `null` at the edge: `schema.parse({ FOO: env.FOO ?? null })`.

### Enums

Use TypeScript `enum` for named domain values, never string-literal unions. For zod: `z.nativeEnum(MyEnum)`.

### Dependency inversion

Constructors accept interfaces (`ISessionStorage`, `WalletManager`). Tests substitute in-memory implementations.

### Errors

Services throw. The MCP SDK catches at the tool boundary and returns `{ isError: true }` automatically. Add `try/catch` inside a tool only when you need to rewrite the error message.

### Comments

Comments explain **why**, not **how** or **what**. The code already says what it does; a comment that restates it is noise and rots. Reserve comments for the non-obvious: a rationale, a trade-off, a footgun, an invariant, a unit/edge-case the types can't express. If a comment just paraphrases the next line, delete it.

This is a **public repository**. Do not reference private/internal infrastructure (server internals, backend services, internal package names, hostnames) in code or comments — keep the source self-contained.

In particular, **never mention the backend or its source** anywhere in code, comments, ABIs, or docs — no file paths, module/enum names, package names (e.g. internal `@…/shared` packages), service names, or "copied/mirrors from `<backend file>`" notes. Describe things only in terms of the public API surface this client consumes (HTTP routes like `GET /api/v1/config`, on-chain contracts/ABIs, env vars). When copying an artifact such as a contract ABI, document only what it is and that it must match the deployed contract — never where it came from. The generic notion of "the game API" / "the server" the client talks to (and the `API_URL` env var) is fine; pointers into a separate backend repo are not.

### Logging

Use the `Logger` from `src/logger/` — do not call `process.stderr.write` directly and do not use `console.log` (banned by ESLint). stdio belongs to MCP JSON-RPC, so logs must stay on stderr.

```typescript
import { rootLogger } from './logger/index.js';

const logger = rootLogger.child('session');
logger.info('loaded session', { address });
logger.error('save failed', { error });
```

The logger redacts sensitive fields automatically (`privateKey`, `jwt`, `mnemonic`, raw `0x`-hex private keys, JWT tokens) in both messages and meta. If a new sensitive key is introduced, extend `SENSITIVE_KEYS` in `src/logger/constants.ts`.

## Conventions

- Files: `kebab-case` with suffixes like `.service.ts`, `.manager.ts`, `.utils.ts`
- Imports: keep the `.js` extension (NodeNext module resolution)
- Tooling configs (`.eslintrc`, `.prettierrc`): use the `.cjs` extension — the package is `"type": "module"`

## Testing

Use `.integration.test.ts` when a test touches real filesystem or network; plain `.test.ts` for pure logic.

Integration tests isolate state with `fs.mkdtempSync(path.join(os.tmpdir(), 'cpu-game-mcp-test-'))` and clean up in `afterEach`. Never touch `os.homedir()`.

Reference: `src/session/__tests__/`.

## Commands

```bash
pnpm install
pnpm build
pnpm typecheck         # type-check including test files (tsconfig.eslint.json)
pnpm test              # all tests
pnpm test:unit         # unit only (skips *.integration.test.ts)
pnpm lint              # zero warnings expected
pnpm lint:fix
pnpm format
```

Run `pnpm lint && pnpm build && pnpm typecheck && pnpm test` before every commit.

## Git

Omit the `Co-Authored-By: Claude ...` trailer from commit messages.

Keep commit messages short: a single subject line capturing the essence. Add a body only when something genuinely needs explaining.
