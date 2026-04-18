import { ToolPage } from "../../pages/ToolPage";

describe("Negative - Basic Validation and Guardrails", () => {
    const toolPage = new ToolPage();

    it("NEG-001: no ready download should appear before user input", () => {
        ["/image-to-pdf", "/compress-image", "/convert-image"].forEach((route) => {
            toolPage.visit(route);
            toolPage.assertRouteLoaded(route);
            toolPage.assertNoResultByDefault();
        });
    });

    it("NEG-002: invalid file upload should not crash the page", () => {
        ["/compress-image", "/image-to-text"].forEach((route) => {
            toolPage.visit(route);
            toolPage.assertRouteLoaded(route);

            // Assignment-friendly negative check: we only verify app stability.
            toolPage.tryInvalidUploadIfAvailable();
            cy.get("body").should("be.visible");
            cy.location("pathname").should("eq", route);
        });
    });

    it("NEG-003: unknown route should still render app shell safely", () => {
        const unknownPath = "/this-route-should-not-exist";

        cy.visit(unknownPath, { failOnStatusCode: false });
        cy.get("body").should("be.visible");

        // SPA should stay mounted even if route is invalid.
        cy.get("#root").should("exist");
    });
});
