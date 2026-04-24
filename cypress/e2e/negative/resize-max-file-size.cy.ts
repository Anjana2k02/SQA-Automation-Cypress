import { ToolPage } from "../../pages/ToolPage";
import {
    appearsAcceptedForProcessing,
    hasFileSizeRejection,
    MAX_IMAGE_UPLOAD_BYTES,
    selectImageFile,
} from "../../support/fileUploadAssertions";

describe("Negative - Resize Image Max File Size", () => {
    const toolPage = new ToolPage();

    it("NEG-004: rejects files larger than 20MB on Resize Image", () => {
        const maxFilePath = "cypress/images/MAX.jpg";

        toolPage.visit("/resize-image");
        toolPage.assertRouteLoaded("/resize-image");

        cy.readFile(maxFilePath, null).then((fileBuffer) => {
            const fileSizeBytes = (fileBuffer as Uint8Array).byteLength;

            // Guard assertion: this test is valid only when MAX.jpg is truly > 20MB.
            expect(fileSizeBytes, "MAX.jpg should be larger than 20MB").to.be.greaterThan(MAX_IMAGE_UPLOAD_BYTES);
        });

        selectImageFile(maxFilePath, "MAX.jpg");

        // Give the app a moment to validate and update UI state.
        cy.wait(1200);

        cy.get("body").then(($body) => {
            const hasRejectionMessage = hasFileSizeRejection($body);
            const appearsAccepted = appearsAcceptedForProcessing($body);

            expect(
                appearsAccepted,
                "MAX.jpg must not show preview, resize controls, or download actions."
            ).to.eq(false);

            expect(hasRejectionMessage, "MAX.jpg must show file-size validation feedback.").to.eq(true);
        });
    });
});
