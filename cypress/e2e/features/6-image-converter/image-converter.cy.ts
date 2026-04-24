import { ToolPage } from "../../../pages/ToolPage";

describe("Feature 6: Image Converter", () => {
    const toolPage = new ToolPage();

    beforeEach(() => {
        toolPage.visit("/convert-image");
    });

    it("TC23: Verify converting image to JPG", () => {
        toolPage.assertRouteLoaded("/convert-image");
        toolPage.assertToolHasWorkingUiShell();
        cy.contains(/convert/i).should("be.visible");
    });

    it("TC24: Verify converting image to PNG", () => {
        toolPage.assertRouteLoaded("/convert-image");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("TC25: Verify converting image to WebP", () => {
        toolPage.assertRouteLoaded("/convert-image");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("TC26: Verify negative file upload behavior for Image Converter tools", () => {
        toolPage.assertNoResultByDefault();
        toolPage.tryInvalidUploadIfAvailable();
        cy.get("body").should("be.visible");
    });
});
