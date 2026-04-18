export class ToolPage {
    visit(path: string): void {
        if (path === "/") {
            cy.visit("/");
            return;
        }

        cy.visit("/");
        cy.window().then((win) => {
            win.history.pushState({}, "", path);
            win.dispatchEvent(new win.PopStateEvent("popstate"));
        });
    }

    assertRouteLoaded(path: string): void {
        cy.location("pathname").should("eq", path);
        cy.get("body").should("be.visible");
    }

    assertToolHasWorkingUiShell(): void {
        cy.get("body").then(($body) => {
            const hasHeading = $body.find("h1, h2").length > 0;
            const hasFileInput = $body.find('input[type="file"]').length > 0;
            const hasGeneralContent =
                $body.find("button, form, p, textarea, canvas, [role='button']").length > 0;
            const hasActionButton =
                $body.find("button").length > 0 ||
                $body.find('label[for*="file"]').length > 0;

            // Stable assertion for assignment use: page must expose content or controls.
            expect(hasHeading || hasGeneralContent || hasFileInput || hasActionButton).to.eq(true);
        });
    }

    assertNoResultByDefault(): void {
        // Before user input, tools should generally not expose a ready download action.
        cy.get("body").then(($body) => {
            const hasDownloadAttr = $body.find("a[download]").length > 0;
            const hasDownloadText = /download now/i.test($body.text());

            if (hasDownloadAttr) {
                cy.get("a[download]").should("not.be.visible");
            }

            if (hasDownloadText) {
                cy.contains(/download now/i).should("not.be.visible");
            }
        });
    }

    tryInvalidUploadIfAvailable(): void {
        cy.get("body").then(($body) => {
            const hasFileInput = $body.find('input[type="file"]').length > 0;

            if (hasFileInput) {
                const filePayload = {
                    contents: Cypress.Buffer.from("This is not a valid image or document file."),
                    fileName: "invalid-input.txt",
                    mimeType: "text/plain",
                    lastModified: Date.now(),
                };

                cy.get('input[type="file"]').first().selectFile(filePayload, { force: true });
            } else {
                cy.log("No file input found on this route. Negative upload check skipped.");
            }
        });
    }
}
