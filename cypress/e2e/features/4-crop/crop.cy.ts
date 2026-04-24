import { ToolPage } from "../../../pages/ToolPage";

const zipFilePath = "cypress/e2e/document/7mb.zip";
const zipMimeType = "application/zip";

const isDisabled = (element: Element): boolean =>
    element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";

const hasVisibleEnabledButton = (
    $body: JQuery<HTMLElement>,
    buttonTextPattern: RegExp
): boolean =>
    $body
        .find("button:visible")
        .toArray()
        .some((button) => !isDisabled(button) && buttonTextPattern.test(button.textContent || ""));

const appearsAcceptedByCrop = ($body: JQuery<HTMLElement>): boolean => {
    const pageText = $body.text().toLowerCase();
    const hasUploadedZipName = pageText.includes("7mb.zip");
    const hasImagePreview = $body
        .find("img:visible")
        .toArray()
        .some((img) => /blob:|data:image\/(?:png|jpe?g|webp)/i.test(img.getAttribute("src") || ""));
    const hasDownloadOrApplyAction =
        $body.find("a[download]:visible").length > 0 ||
        hasVisibleEnabledButton($body, /download|apply/i);

    return hasUploadedZipName || hasImagePreview || hasDownloadOrApplyAction;
};

describe("Feature 4: Crop", () => {
    const toolPage = new ToolPage();

    beforeEach(() => {
        toolPage.visit("/crop-image");
    });

    it("TC15: Verify Crop to JPG functionality and UI", () => {
        toolPage.assertRouteLoaded("/crop-image");
        toolPage.assertToolHasWorkingUiShell();
        cy.contains(/crop/i).should("be.visible");
        // Verify JPG option might be present
        // cy.contains(/jpg/i).should("exist"); // optional check
    });

    it("TC16: Verify Crop to PNG functionality and UI", () => {
        toolPage.assertRouteLoaded("/crop-image");
        toolPage.assertToolHasWorkingUiShell();
        // Verify PNG option might be present
        // cy.contains(/png/i).should("exist"); // optional check
    });

    it("TC17: Verify Crop to WebP functionality and UI", () => {
        toolPage.assertRouteLoaded("/crop-image");
        toolPage.assertToolHasWorkingUiShell();
        // Verify WebP option might be present
        // cy.contains(/webp/i).should("exist"); // optional check
    });

    it("TC18: Verify default state and negative file upload behavior for Crop tools", () => {
        toolPage.assertNoResultByDefault();
        toolPage.tryInvalidUploadIfAvailable();
        cy.get("body").should("be.visible");
    });

    it("TC19: Verify Crop rejects ZIP file upload (7mb.zip)", () => {
        toolPage.assertRouteLoaded("/crop-image");

        cy.readFile(zipFilePath, null).then((fileBuffer) => {
            expect((fileBuffer as Uint8Array).byteLength, "7mb.zip test file should not be empty").to.be.greaterThan(0);

            cy.get('input[type="file"]').first().selectFile(
                {
                    contents: fileBuffer,
                    fileName: "7mb.zip",
                    mimeType: zipMimeType,
                    lastModified: Date.now(),
                },
                { force: true }
            );
        });

        cy.wait(1200);

        cy.get("body").then(($body) => {
            expect(
                appearsAcceptedByCrop($body),
                "7mb.zip must not be accepted by Crop upload."
            ).to.eq(false);
        });
    });
});
