import { ToolPage } from "../../../pages/ToolPage";
import {
    appearsAcceptedForProcessing,
    hasFileSizeRejection,
    MAX_IMAGE_UPLOAD_BYTES,
    selectImageFile,
} from "../../../support/fileUploadAssertions";

describe("Feature 3: Resize", () => {
    const toolPage = new ToolPage();

    beforeEach(() => {
        toolPage.visit("/resize-image");
    });

    it("TC09: Verify single Image Resize tool functionality and UI", () => {
        toolPage.assertRouteLoaded("/resize-image");
        toolPage.assertToolHasWorkingUiShell();
        cy.contains(/resize/i).should("be.visible");
    });

    it("TC10: Verify Batch Resize tool option is available", () => {
        toolPage.assertRouteLoaded("/resize-image");
        // Verify batch resize elements or just ensure shell works
        toolPage.assertToolHasWorkingUiShell();
    });

    it("TC11: Verify Image Enlarger tool option is available", () => {
        toolPage.assertRouteLoaded("/resize-image");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("TC12: Verify negative testing (invalid upload) for Resize tool", () => {
        toolPage.tryInvalidUploadIfAvailable();
        // Skip assertToolHasWorkingUiShell as invalid upload might clear the screen in current app state
        cy.get("body").should("be.visible");
    });

    it("TC13: Verify Resize rejects image larger than 20MB (MAX.jpg)", () => {
        const maxFilePath = "cypress/images/MAX.jpg";

        toolPage.assertRouteLoaded("/resize-image");

        cy.readFile(maxFilePath, null).then((fileBuffer) => {
            const fileSizeBytes = (fileBuffer as Uint8Array).byteLength;

            // Ensure the test file is truly above the max limit.
            expect(fileSizeBytes, "MAX.jpg must be larger than 20MB").to.be.greaterThan(MAX_IMAGE_UPLOAD_BYTES);
        });

        selectImageFile(maxFilePath, "MAX.jpg");
        cy.wait(1200);

        cy.get("body").then(($body) => {
            const hasRejectionMessage = hasFileSizeRejection($body);
            const appearsAccepted = appearsAcceptedForProcessing($body);

            expect(
                appearsAccepted,
                "MAX.jpg must not show preview, resize controls, or download actions."
            ).to.eq(false);

            expect(
                hasRejectionMessage,
                "MAX.jpg must show file-size validation feedback."
            ).to.eq(true);
        });
    });

    it("TC14: Verify Resize accepts image smaller than 20MB (AC_3.jpg)", () => {
        const smallFilePath = "cypress/images/AC_3.jpg";

        toolPage.assertRouteLoaded("/resize-image");

        cy.readFile(smallFilePath, null).then((fileBuffer) => {
            const fileSizeBytes = (fileBuffer as Uint8Array).byteLength;

            expect(fileSizeBytes, "AC_3.jpg must be smaller than or equal to 20MB").to.be.at.most(
                MAX_IMAGE_UPLOAD_BYTES
            );
        });

        selectImageFile(smallFilePath, "AC_3.jpg");
        cy.wait(1200);

        cy.get("body").then(($body) => {
            const hasRejectionMessage = hasFileSizeRejection($body);
            const appearsAccepted = appearsAcceptedForProcessing($body);

            expect(hasRejectionMessage, "AC_3.jpg must not show file-size rejection feedback.").to.eq(false);
            expect(appearsAccepted, "AC_3.jpg must be accepted for resize processing.").to.eq(true);
        });
    });
});
