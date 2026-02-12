# Code Structure — Contium

## Project Structure

```
contium-dapp/
|
|-- README.md                    # Main documentation
|-- LICENSE                      # MIT License
|-- .gitignore                   # Files ignored by Git
|
|-- contracts/                   # Smart Contracts (Hardhat)
|   |
|   |-- contracts/               # Solidity source code
|   |   |-- DocumentRegistry.sol # Document registration and validation
|   |   |-- ContiumBadge.sol     # NFT Badge ERC-721
|   |   +-- Counter.sol          # Test contract
|   |
|   |-- scripts/                 # Deployment scripts
|   |   +-- deploy.js            # Deploy to zkSYS
|   |
|   |-- test/                    # Unit tests
|   |   |-- DocumentRegistry.test.js  # 15 tests
|   |   +-- Counter.ts           # Counter tests
|   |
|   |-- hardhat.config.ts        # Hardhat 3 configuration
|   |-- package.json             # Contract dependencies
|   |-- deployments.json         # Deployed addresses
|   |-- .env                     # Private variables (NOT in Git)
|   +-- .gitignore               # Ignores .env, artifacts, cache
|
|-- frontend/                    # Web Application (SvelteKit)
|   |
|   |-- src/
|   |   |
|   |   |-- routes/              # Application pages
|   |   |   |-- +layout.svelte   # Global layout
|   |   |   |-- +page.svelte     # Landing page (/)
|   |   |   |
|   |   |   |-- app/             # Main dashboard
|   |   |   |   +-- +page.svelte # Upload, register, validate
|   |   |   |
|   |   |   |-- leaderboard/     # User ranking
|   |   |   |   +-- +page.svelte # Top users by score
|   |   |   |
|   |   |   +-- test/            # Test page
|   |   |       +-- +page.svelte
|   |   |
|   |   +-- lib/                 # Shared code
|   |       |
|   |       |-- components/      # Svelte components
|   |       |   |-- WalletConnect.svelte      # Pali Wallet connection
|   |       |   |-- FileUpload.svelte         # Upload + SHA-256 hash
|   |       |   |-- RegisterButton.svelte     # Register on blockchain
|   |       |   |-- ValidateButton.svelte     # Validate document
|   |       |   |-- MintBadgeButton.svelte    # Mint NFT
|   |       |   |-- TxConfirmation.svelte     # TX confirmation progress
|   |       |   |-- InstructionPanel.svelte   # Step-by-step guide
|   |       |   |-- Hero.svelte               # Hero landing section
|   |       |   |-- HowItWorks.svelte         # Explanatory section
|   |       |   |-- JourneySection.svelte     # Step timeline
|   |       |   |-- Features.svelte           # Features section
|   |       |   |-- Footer.svelte             # Footer
|   |       |   +-- PrivacyModal.svelte       # Privacy modal
|   |       |
|   |       +-- config.js        # Addresses, ABIs, network
|   |
|   |-- package.json             # Frontend dependencies
|   |-- svelte.config.js         # SvelteKit config
|   |-- vite.config.js           # Vite config
|   +-- tsconfig.json            # TypeScript config
|
+-- docs/                        # Documentation
    |-- ARCHITECTURE.md          # System architecture
    |-- FLOW_DIAGRAM.md          # Technical flow diagrams
    |-- PRIVACY_SECURITY.md      # Privacy and security
    +-- CODE_STRUCTURE.md        # This file
```

## Naming Conventions

| Type              | Convention      | Example                  |
|-------------------|-----------------|--------------------------|
| Svelte files      | PascalCase      | `WalletConnect.svelte`   |
| JS/TS files       | camelCase       | `config.js`              |
| Solidity files    | PascalCase      | `DocumentRegistry.sol`   |
| Components        | PascalCase      | `<FileUpload />`         |
| Variables         | camelCase       | `walletAddress`          |
| Constants         | SCREAMING_SNAKE | `NETWORK`, `CONTRACTS`   |
| Functions         | camelCase       | `handleSubmit()`         |
| Solidity events   | PascalCase      | `DocumentRegistered`     |
| CSS classes       | kebab-case      | `.upload-card`           |

## Git Commits

We use Conventional Commits:

```
feat: new feature
fix: bug fix
docs: documentation
style: formatting (no logic changes)
refactor: code restructuring
test: add or modify tests
chore: maintenance tasks
```

---

Copyright 2025 Contium by ChainPort