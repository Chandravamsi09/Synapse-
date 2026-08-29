# Synapse Enterprise API & App Gateway

Synapse is a high-performance enterprise gateway and app integration orchestration platform.

---

## Installation

To install all dependencies and set up the local development environment:

```bash
# Clone the repository
git clone https://github.com/Chandravamsi09/Synapse-.git
cd Synapse-

# Install root and workspace dependencies
npm install
```

---

## Build

To compile all TypeScript services, client SDKs, and bundle the developer portal:

```bash
# Run the monorepo build script
npm run build
```

---

## Run

To launch the Synapse Core Gateway and Developer Web Portal:

```bash
# Start API Gateway & Management Service
npm run start

# In another terminal, start the Web Portal
npm run start:web

# Run the automated test suites with coverage
npm run test:coverage
```

---

## License
Proprietary. Copyright (c) 2026 Synapse Technologies Inc.
