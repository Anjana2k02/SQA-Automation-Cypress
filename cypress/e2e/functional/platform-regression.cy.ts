import {
    appearsAcceptedForProcessing,
    hasFileSizeRejection,
    MAX_IMAGE_UPLOAD_BYTES,
    selectImageFile,
} from "../../support/fileUploadAssertions";

type Summary = {
    total: number;
    passed: number;
    failed: number;
};

const testStates = new Map<string, string>();

const visitSpaRoute = (path: string): void => {
    if (path === "/") {
        cy.visit("/");
        return;
    }

    cy.visit("/");
    cy.window().then((win) => {
        win.history.pushState({}, "", path);
        win.dispatchEvent(new win.PopStateEvent("popstate"));
    });
};

describe("Non Transliteration Coverage", () => {
    afterEach(function () {
        const fullTitle = this.currentTest?.fullTitle();
        const state = this.currentTest?.state;

        if (fullTitle && state) {
            // Overwrite state on retries so final test state is counted once.
            testStates.set(fullTitle, state);
        }
    });

    after(() => {
        const summary: Summary = {
            total: testStates.size,
            passed: Array.from(testStates.values()).filter((state) => state === "passed").length,
            failed: Array.from(testStates.values()).filter((state) => state === "failed").length,
        };

        const summaryMessage =
            `SUMMARY => Total Test Cases: ${summary.total}, ` +
            `Passed: ${summary.passed}, Failed: ${summary.failed}`;

        cy.log(summaryMessage);
        cy.task("log", summaryMessage);
    });

    describe("Homepage - 30 Simple Cases", () => {
        const homepageLabels = [
            /pixelssuite/i,
            /document converter/i,
            /editor/i,
            /resize/i,
            /crop/i,
            /compress/i,
            /image converter/i,
            /more/i,
            /free online tools/i,
            /image\s*→?\s*pdf/i,
            /pdf\s*→?\s*word/i,
            /word\s*→?\s*pdf/i,
            /open editor/i,
            /batch resize/i,
            /image enlarger/i,
            /to jpg/i,
            /to png/i,
            /to webp/i,
            /compress image/i,
            /to gif/i,
            /rotate/i,
            /flip/i,
            /meme/i,
            /color picker/i,
            /image\s*→?\s*text/i,
            /about us/i,
            /contact/i,
            /privacy/i,
            /terms/i,
            /disclaimer/i,
        ];

        beforeEach(() => {
            visitSpaRoute("/");
        });

        homepageLabels.forEach((label, index) => {
            it(`HOME-${String(index + 1).padStart(3, "0")}: shows ${label}`, () => {
                cy.contains("body", label).should("exist");
            });
        });
    });

    describe("Feature Routes - 70 Simple Cases", () => {
        const routes = [
            "/image-to-pdf",
            "/pdf-to-word",
            "/word-to-pdf",
            "/pdf-editor",
            "/resize-image",
            "/bulk-resize",
            "/crop-image",
            "/compress-image",
            "/convert-image",
            "/convert-to-jpg",
            "/convert-to-png",
            "/convert-to-webp",
            "/image-to-text",
            "/color-picker",
        ];

        routes.forEach((route, routeIndex) => {
            describe(`Route ${route}`, () => {
                beforeEach(() => {
                    visitSpaRoute(route);
                });

                it(`ROUTE-${routeIndex + 1}-01: path is correct`, () => {
                    cy.location("pathname").should("eq", route);
                });

                it(`ROUTE-${routeIndex + 1}-02: page body is visible`, () => {
                    cy.get("body").should("be.visible");
                });

                it(`ROUTE-${routeIndex + 1}-03: contains at least one key UI element`, () => {
                    cy.get("h1, h2, button, input[type='file'], p, form, canvas, a")
                        .its("length")
                        .should("be.gte", 1);
                });

                it(`ROUTE-${routeIndex + 1}-04: has clickable or actionable element`, () => {
                    cy.get("button, a, input[type='file']")
                        .its("length")
                        .should("be.gte", 1);
                });

                it(`ROUTE-${routeIndex + 1}-05: route excludes transliteration`, () => {
                    cy.location("pathname").should("not.contain", "transliteration");
                });
            });
        });
    });

    describe("Assignment Defect Checks - Intentionally Expected Failures", () => {
        it("DEFECT-001: Transliteration should not appear in navbar (expected fail)", () => {
            visitSpaRoute("/");

            // Assignment defect demonstration: this is expected to fail because
            // the current UI still shows Transliteration in navigation.
            cy.contains("a, button", /transliteration/i).should("not.exist");
        });

        it("DEFECT-002: Image to PDF should show max 10MB (expected fail)", () => {
            visitSpaRoute("/image-to-pdf");

            // Intentional expected failure for assignment reporting.
            cy.contains(/max\s*10mb/i).should("exist");
        });

        it("DEFECT-003: Resize should reject MAX.jpg > 20MB (expected fail if bug exists)", () => {
            visitSpaRoute("/resize-image");

            cy.readFile("cypress/images/MAX.jpg", null).then((fileBuffer) => {
                const fileSizeBytes = (fileBuffer as Uint8Array).byteLength;

                expect(fileSizeBytes).to.be.greaterThan(MAX_IMAGE_UPLOAD_BYTES);
            });

            selectImageFile("cypress/images/MAX.jpg", "MAX.jpg");
            cy.wait(1200);

            // This will fail when the known size-validation bug is present.
            cy.get("body").then(($body) => {
                expect(
                    appearsAcceptedForProcessing($body),
                    "MAX.jpg must not show preview, resize controls, or download actions."
                ).to.eq(false);

                expect(hasFileSizeRejection($body), "MAX.jpg must show file-size validation feedback.").to.eq(true);
            });
        });
    });
});
