import { ToolPage } from "../../pages/ToolPage";

describe("Functional - Document Converter", () => {
    const toolPage = new ToolPage();

    it("FUN-001: Image to PDF page loads with usable controls", () => {
        toolPage.visit("/image-to-pdf");
        toolPage.assertRouteLoaded("/image-to-pdf");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("FUN-002: PDF to Word page loads with usable controls", () => {
        toolPage.visit("/pdf-to-word");
        toolPage.assertRouteLoaded("/pdf-to-word");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("FUN-003: Word to PDF page loads with usable controls", () => {
        toolPage.visit("/word-to-pdf");
        toolPage.assertRouteLoaded("/word-to-pdf");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("FUN-011: Image to PDF page shows expected upload and conversion panels", () => {
        toolPage.visit("/image-to-pdf");
        toolPage.assertRouteLoaded("/image-to-pdf");

        // Validate key UI text and controls shown in the Image -> PDF workflow.
        cy.contains(/image\s*→?\s*pdf/i).should("be.visible");
        cy.contains(/drag and drop your file here/i).should("be.visible");
        cy.contains(/select images/i).should("be.visible");
        cy.contains(/supported:\s*png,\s*jpg,\s*webp/i).should("be.visible");
        cy.contains(/max\s*20mb/i).should("be.visible");
        cy.contains(/selected images/i).should("be.visible");
        cy.contains(/preview/i).should("be.visible");
        cy.contains(/create pdf/i).should("be.visible");
    });
});
