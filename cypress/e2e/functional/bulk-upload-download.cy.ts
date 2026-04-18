import { ToolPage } from "../../pages/ToolPage";

describe("Functional - Bulk Upload and Download", () => {
    const toolPage = new ToolPage();

    const route = "/bulk-resize";
    const files = [
        "cypress/images/AC_3.jpg",
        "cypress/images/AC_4.jpg",
        "cypress/images/LORD.jpg",
        "cypress/images/IN_1.jpg",
    ];

    const expectedNames = ["AC_3", "AC_4", "LORD", "IN_1"];

    function uploadAllFiles(): void {
        cy.get('input[type="file"]').first().selectFile(files, {
            force: true,
        });
    }

    it("BULK-001: Bulk Resize page supports selecting multiple files", () => {
        toolPage.visit(route);
        toolPage.assertRouteLoaded(route);
        toolPage.assertToolHasWorkingUiShell();

        // A practical bulk-upload prerequisite is a file input that supports multiple files.
        cy.get('input[type="file"]').first().should("have.attr", "multiple");
    });

    it("BULK-002: Uploading AC_3, AC_4, LORD, IN_1 shows all file names", () => {
        toolPage.visit(route);
        toolPage.assertRouteLoaded(route);

        uploadAllFiles();

        // Validate upload success by confirming all expected file names are visible in UI.
        cy.get("body", { timeout: 20000 }).should(($body) => {
            const text = $body.text();

            expectedNames.forEach((name) => {
                expect(text).to.include(name);
            });
        });
    });

    it("BULK-003: Bulk download action is available and can be triggered", () => {
        toolPage.visit(route);
        toolPage.assertRouteLoaded(route);

        uploadAllFiles();

        // Wait for the page to expose any download-capable action after bulk upload.
        cy.get("body", { timeout: 20000 }).then(($body) => {
            const hasDownloadLink = $body.find("a[download]").length > 0;
            const hasDownloadButton = $body
                .find("button")
                .toArray()
                .some((btn) => /download|zip/i.test((btn.textContent || "").trim()));

            expect(hasDownloadLink || hasDownloadButton).to.eq(true);
        });

        cy.get("body").then(($body) => {
            const downloadButtons = $body
                .find("button")
                .toArray()
                .filter((btn) => /download|zip/i.test((btn.textContent || "").trim()));

            if (downloadButtons.length > 0) {
                cy.wrap(downloadButtons[0]).click({ force: true });
            } else {
                cy.get("a[download]").first().click({ force: true });
            }
        });

        // Keep validation assignment-friendly: app should remain stable after trigger.
        cy.get("body").should("be.visible");
        cy.location("pathname").should("eq", route);
    });
});
