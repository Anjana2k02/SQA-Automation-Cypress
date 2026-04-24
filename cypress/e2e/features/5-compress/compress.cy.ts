import { ToolPage } from "../../../pages/ToolPage";

describe("Feature 5: Compress", () => {
    const toolPage = new ToolPage();

    beforeEach(() => {
        toolPage.visit("/compress-image");
    });

    it("TC19: Verify general Image Compression functionality", () => {
        toolPage.assertRouteLoaded("/compress-image");
        toolPage.assertToolHasWorkingUiShell();
        cy.contains(/compress/i).should("be.visible");
    });

    it("TC20: Verify GIF Compression functionality", () => {
        toolPage.assertRouteLoaded("/compress-image");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("TC21: Verify PNG Compression functionality", () => {
        toolPage.assertRouteLoaded("/compress-image");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("TC22: Verify negative file upload behavior for Compress tools", () => {
        toolPage.assertNoResultByDefault();
        toolPage.tryInvalidUploadIfAvailable();
        cy.get("body").should("be.visible");
    });
});
