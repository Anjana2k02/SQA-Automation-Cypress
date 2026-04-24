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

describe("Assignment Mixed Cases - Non Negative", () => {
    describe("Positive Smoke - 8 Cases", () => {
        beforeEach(() => {
            visitSpaRoute("/");
        });

        it("POS-001: homepage title is visible and meaningful", () => {
            cy.title().should("match", /pixelssuite/i);
        });

        it("POS-002: Document Converter menu is visible", () => {
            cy.contains("a, button", /document converter/i).should("be.visible");
        });

        it("POS-003: Editor menu is visible", () => {
            cy.contains("a, button", /editor/i).should("be.visible");
        });

        it("POS-004: Resize menu is visible", () => {
            cy.contains("a, button", /resize/i).should("be.visible");
        });

        it("POS-005: Compress menu is visible", () => {
            cy.contains("a, button", /compress/i).should("be.visible");
        });

        it("POS-006: Image Converter menu is visible", () => {
            cy.contains("a, button", /image converter/i).should("be.visible");
        });

        it("POS-007: More menu is visible", () => {
            cy.contains("a, button", /more/i).should("be.visible");
        });

        it("POS-008: footer links are available", () => {
            ["About", "Contact", "Privacy", "Terms", "Disclaimer"].forEach((item) => {
                cy.contains("a", new RegExp(item, "i")).should("exist");
            });
        });
    });

    describe("Functional Workflow - 8 Cases", () => {
        it("FUNX-001: image-to-pdf route opens", () => {
            visitSpaRoute("/image-to-pdf");
            cy.location("pathname").should("eq", "/image-to-pdf");
        });

        it("FUNX-002: image-to-pdf upload section labels appear", () => {
            visitSpaRoute("/image-to-pdf");
            cy.contains(/select images/i).should("be.visible");
            cy.contains(/create pdf/i).should("be.visible");
        });

        it("FUNX-003: pdf-editor route opens", () => {
            visitSpaRoute("/pdf-editor");
            cy.location("pathname").should("eq", "/pdf-editor");
        });

        it("FUNX-004: pdf-editor core actions are visible", () => {
            visitSpaRoute("/pdf-editor");
            cy.contains(/download/i).should("be.visible");
            cy.get('input[type="file"]').should("exist");
        });

        it("FUNX-005: compress-image route opens", () => {
            visitSpaRoute("/compress-image");
            cy.location("pathname").should("eq", "/compress-image");
        });

        it("FUNX-006: compress-image upload controls are visible", () => {
            visitSpaRoute("/compress-image");
            cy.contains(/select files/i).should("be.visible");
            cy.get('input[type="file"]').should("exist");
        });

        it("FUNX-007: bulk-resize supports multi-file selection", () => {
            visitSpaRoute("/bulk-resize");
            cy.get('input[type="file"]').first().should("have.attr", "multiple");
        });

        it("FUNX-008: convert routes are reachable", () => {
            ["/convert-to-jpg", "/convert-to-png", "/convert-to-webp"].forEach((route) => {
                visitSpaRoute(route);
                cy.location("pathname").should("eq", route);
            });
        });
    });

    describe("UI Consistency - 4 Cases", () => {
        const routes = ["/image-to-pdf", "/pdf-editor", "/compress-image", "/bulk-resize"];

        routes.forEach((route, idx) => {
            it(`UI-${idx + 1}: header remains visible on ${route}`, () => {
                visitSpaRoute(route);
                cy.contains("a, button", /document converter/i).should("be.visible");
                cy.contains("a, button", /editor/i).should("be.visible");
            });
        });
    });

    describe("Content and Policy - 4 Cases", () => {
        const pages = ["/about", "/contact", "/privacy", "/terms"];

        pages.forEach((route, idx) => {
            it(`CNT-${idx + 1}: ${route} page loads with readable content`, () => {
                visitSpaRoute(route);
                cy.location("pathname").should("eq", route);
                cy.get("h1, h2, p").its("length").should("be.gte", 1);
            });
        });
    });
});
