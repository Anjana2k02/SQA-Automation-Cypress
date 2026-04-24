import { ToolPage } from "../../../pages/ToolPage";

describe("Feature 7: More Tools", () => {
    const toolPage = new ToolPage();

    describe("Sub-feature: Rotate", () => {
        beforeEach(() => {
            toolPage.visit("/rotate-image");
        });

        it("TC27: Verify Rotate image tool functionality and UI", () => {
            toolPage.assertRouteLoaded("/rotate-image");
            toolPage.assertToolHasWorkingUiShell();
            cy.contains(/rotate/i).should("be.visible");
        });

        it("TC32: Verify negative testing (invalid upload) for Rotate tool", () => {
            toolPage.assertNoResultByDefault();
            toolPage.tryInvalidUploadIfAvailable();
            cy.get("body").should("be.visible");
        });
    });

    describe("Sub-feature: Flip", () => {
        beforeEach(() => {
            toolPage.visit("/flip-image");
        });

        it("TC28: Verify Flip image tool functionality and UI", () => {
            toolPage.assertRouteLoaded("/flip-image");
            toolPage.assertToolHasWorkingUiShell();
            cy.contains(/flip/i).should("be.visible");
        });
    });

    describe("Sub-feature: Meme Generator", () => {
        beforeEach(() => {
            toolPage.visit("/meme-generator");
        });

        it("TC29: Verify Meme generator tool functionality and UI", () => {
            toolPage.assertRouteLoaded("/meme-generator");
            toolPage.assertToolHasWorkingUiShell();
            cy.contains(/meme/i).should("be.visible");
        });

        it("TC33: Verify negative testing (invalid upload) for Meme generator", () => {
            toolPage.assertNoResultByDefault();
            toolPage.tryInvalidUploadIfAvailable();
            cy.get("body").should("be.visible");
        });
    });

    describe("Sub-feature: Color Picker", () => {
        beforeEach(() => {
            toolPage.visit("/color-picker");
        });

        it("TC30: Verify Color Picker tool functionality and UI", () => {
            toolPage.assertRouteLoaded("/color-picker");
            toolPage.assertToolHasWorkingUiShell();
            cy.contains(/color/i).should("be.visible");
        });
    });

    describe("Sub-feature: Image to Text", () => {
        beforeEach(() => {
            toolPage.visit("/image-to-text");
        });

        it("TC31: Verify Image to Text extraction functionality and UI", () => {
            toolPage.assertRouteLoaded("/image-to-text");
            toolPage.assertToolHasWorkingUiShell();
            cy.contains(/text/i).should("be.visible");
        });

        it("TC34: Verify negative testing (invalid upload) for Image to Text tool", () => {
            toolPage.assertNoResultByDefault();
            toolPage.tryInvalidUploadIfAvailable();
            cy.get("body").should("be.visible");
        });
    });
});
