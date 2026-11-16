# Test data and config

- Test data goes in `test-data/*.json` and is exported via `test-data/index.ts` (`testData.<name>`). Import from there; don't inline literals in specs.
- Environment values (URLs etc.) go in `config/environments/<name>.json`; add the field to `EnvConfig` in `config/env.ts` first. Read them through `env`, never hard-code hosts.
- A new environment = a new JSON file with the same keys as `dev.json`. `TEST_ENV` selects it, and an unknown name fails fast.
- Never commit secrets, tokens or real credentials. If secrets are needed, read them from `process.env` (CI secrets) and document the variable name in `CLAUDE.md`.
