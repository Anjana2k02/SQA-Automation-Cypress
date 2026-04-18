# Cypress Automation Framework

A clean Cypress end-to-end automation framework using TypeScript and Page Object Model (POM).

## Stack

- Cypress
- TypeScript
- POM + custom commands

## Project Structure

```text
cypress/
  e2e/
    smoke/
      homepage.cy.ts
      navigation.cy.ts
  fixtures/
    testData.json
  pages/
    HomePage.ts
  support/
    commands.ts
    e2e.ts
    index.d.ts
cypress.config.ts
tsconfig.json
```

## Configuration

- Base URL: `https://www.pixelssuite.com`
- Retries: enabled in run mode (`2`)
- Video + screenshots on failure: enabled

## Run Tests

```bash
npm run cypress:open
npm run cypress:run
npm run cypress:run:chrome
npm run cypress:smoke
npm run cypress:verify
```

## Best Practices Applied

- POM abstraction for selectors and actions
- Reusable custom commands
- Type-safe command augmentation
- Smoke-first spec organization
- Deterministic fixture-based assertions
