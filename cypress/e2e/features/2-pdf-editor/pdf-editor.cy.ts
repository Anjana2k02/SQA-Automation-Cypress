import { ToolPage } from "../../../pages/ToolPage";

describe("Feature 2: PDF Editor", () => {
    const toolPage = new ToolPage();

    describe("Sub-feature: PDF Editor", () => {
        beforeEach(() => {
            toolPage.visit("/pdf-editor");
        });

        it("TC06: Verify PDF Editor tool opens correctly", () => {
            toolPage.assertRouteLoaded("/pdf-editor");
            toolPage.assertToolHasWorkingUiShell();
            
            // Check that page title/heading contains PDF Editor
            cy.contains(/pdf editor/i).should("be.visible");
        });

        it("TC07: Verify PDF Editor essential UI components and instructions", () => {
            toolPage.assertRouteLoaded("/pdf-editor");
            // Check for upload or file input area
            cy.get('input[type="file"]').should("exist");
            // Ensure no download available initially
            toolPage.assertNoResultByDefault();
        });

        it("TC08: Verify negative upload handling for PDF Editor", () => {
            toolPage.tryInvalidUploadIfAvailable();
            cy.get("body").should("be.visible");
        });
    });
});
