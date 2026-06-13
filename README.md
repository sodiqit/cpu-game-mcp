# cpu-game-mcp

MCP (Model Context Protocol) server for **CPU Game** — a blockchain game on EVM. It lets an
AI agent play on your behalf: read the world map, reveal cells, build and mine, craft, move
resources, and trade at marketplaces. Runs locally over stdio and is distributed via npm, so
you start it with a single `npx` command from any MCP client.

## Quick start

Add the server to your MCP client config (e.g. `claude_desktop_config.json` or an `mcp.json`).
The only required setting is your wallet's `PRIVATE_KEY`:

```jsonc
{
  "mcpServers": {
    "cpu-game": {
      "command": "npx",
      "args": ["-y", "cpu-game-mcp@latest"],
      "env": {
        "PRIVATE_KEY": "0x…" // 0x + 64 hex chars (your 32-byte private key)
      }
    }
  }
}
```

## Environment variables

**Required**

| Variable | Description |
| --- | --- |
| `PRIVATE_KEY` | Your wallet private key — `0x` followed by 64 hex chars (32 bytes). |

**Optional** — has a sensible default; normal users can omit it.

| Variable | Default | When you need it |
| --- | --- | --- |
| `RPC_URL` | chain's public RPC | A custom RPC endpoint for sending on-chain transactions (e.g. `reveal`). |

Session state (JWT / session keys) is persisted to `~/.cpu-game/`.

## What the agent can do

Once connected, the server exposes tools grouped by area:

- **Session** — `authenticate`, `get_game_config` (static rulebook: resources, costs, contract
  addresses), `get_balance` (spendable $CPU + gas).
- **World** — `get_map`, `get_cell`, `get_changes` (react to other players).
- **Reveal & build** — `reveal` (surface a cell's deposits on-chain), `build` (place a
  building; an extractor starts mining automatically), `get_mining_status`, `claim_mining`.
- **Transport** — `quote_transport`, `transport`, `get_transport_status`,
  `list_my_transports`, `get_pending_transports`, `resume_transport`.
- **Crafting** — `list_recipes`, `craft`, `get_craft_status`, `claim_craft`.
- **Trading** — `get_markets`, `list_lots`, `get_lot`, `quote_buy`, `buy_lot`, `create_lot`,
  `cancel_lot`, `list_my_lots`.

Paid routes and on-chain actions are settled automatically; always check `get_balance` before
a paid action.

## Requirements

- Node.js ≥ 20

## License

[MIT](./LICENSE)
