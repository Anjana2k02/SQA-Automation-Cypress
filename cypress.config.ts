import { defineConfig } from "cypress";

export default defineConfig({
    allowCypressEnv: false,
    e2e: {
        baseUrl: "https://www.pixelssuite.com",
        specPattern: "cypress/e2e/**/*.cy.ts",
        supportFile: "cypress/support/e2e.ts",
        video: true,
        screenshotOnRunFailure: true,
        retries: {
            runMode: 2,
            openMode: 0,
        },
        defaultCommandTimeout: 10000,
        pageLoadTimeout: 60000,
        viewportWidth: 1440,
        viewportHeight: 900,
    },
});
