import { ToolPage } from "../../pages/ToolPage";

describe("Negative - Resize Image Max File Size", () => {
    const toolPage = new ToolPage();

    it("NEG-004: rejects files larger than 20MB on Resize Image", () => {
        const maxFilePath = "cypress/images/MAX.jpg";
        const maxAllowedBytes = 20 * 1024 * 1024;

        toolPage.visit("/resize-image");
        toolPage.assertRouteLoaded("/resize-image");

        cy.readFile(maxFilePath, null).then((fileBuffer) => {
            const fileSizeBytes = (fileBuffer as Uint8Array).byteLength;

            // Guard assertion: this test is valid only when MAX.jpg is truly > 20MB.
            expect(fileSizeBytes, "MAX.jpg should be larger than 20MB").to.be.greaterThan(maxAllowedBytes);

            cy.get('input[type="file"]').first().selectFile(
                {
                    contents: fileBuffer,
                    fileName: "MAX.jpg",
                    mimeType: "image/jpeg",
                    lastModified: Date.now(),
                },
                { force: true }
            );
        });

        // Give the app a moment to validate and update UI state.
        cy.wait(1200);

        cy.get("body").then(($body) => {
            const pageText = $body.text().toLowerCase();

            const rejectionHints = [
                "20mb",
                "20 mb",
                "max file size",
                "maximum file size",
                "file is too large",
                "too large",
                "exceed",
                "limit",
                "size",
            ];

            const hasRejectionMessage = rejectionHints.some((hint) => pageText.includes(hint));

            // Success indicators imply the app accepted the file for upload/processing.
            const hasVisibleDownloadAction =
                $body.find('a[download]:visible').length > 0 ||
                $body
                    .find("button:visible")
                    .toArray()
                    .some((btn) => /download/i.test((btn.textContent || "").trim()));

            const hasUploadedFileNameVisible = /max\.jpg/i.test(pageText);
            const hasImagePreview =
                $body
                    .find("img")
                    .toArray()
                    .some((img) => /blob:|data:image|max\.jpg/i.test((img.getAttribute("src") || "").toLowerCase())) ||
                /preview|uploaded image|selected image/i.test(pageText);

            const appearsAccepted =
                hasVisibleDownloadAction || hasUploadedFileNameVisible || hasImagePreview;

            if (appearsAccepted) {
                throw new Error(
                    "Fail - System allows files exceeding the maximum size limit (20MB)."
                );
            }

            expect(
                hasRejectionMessage,
                "Pass - File larger than 20MB is rejected by validation."
            ).to.eq(true);
        });
    });
});
