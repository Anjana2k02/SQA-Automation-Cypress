import { defineConfig } from "cypress";
import fs from "node:fs";
import path from "node:path";

const downloadsFolder = path.resolve(__dirname, "cypress", "downloads");

export default defineConfig({
    allowCypressEnv: false,
    e2e: {
        setupNodeEvents(on) {
            on("task", {
                clearDownloads() {
                    fs.mkdirSync(downloadsFolder, { recursive: true });

                    fs.readdirSync(downloadsFolder).forEach((fileName) => {
                        fs.rmSync(path.join(downloadsFolder, fileName), {
                            force: true,
                            recursive: true,
                        });
                    });

                    return null;
                },
                downloadedFiles() {
                    if (!fs.existsSync(downloadsFolder)) {
                        return [];
                    }

                    return fs
                        .readdirSync(downloadsFolder)
                        .filter((fileName) =>
                            fs.statSync(path.join(downloadsFolder, fileName)).isFile()
                        );
                },
                log(message: string) {
                    console.log(message);
                    return null;
                },
            });
        },
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
