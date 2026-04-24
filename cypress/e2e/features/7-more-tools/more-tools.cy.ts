import { ToolPage } from "../../../pages/ToolPage";

const textImagePath = "cypress/images/text.jpg";
const zipFilePath = "cypress/e2e/document/7mb.zip";
const jpgMimeType = "image/jpeg";
const zipMimeType = "application/zip";
const expectedOcrTextPattern = /langham|tom|scout|cub|payment|bedtime/i;

const isDisabled = (element: Element): boolean =>
    element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";

const getVisibleEnabledButton = (
    $body: JQuery<HTMLElement>,
    buttonTextPattern: RegExp
): HTMLElement | undefined =>
    $body
        .find("button:visible")
        .toArray()
        .find((button) => !isDisabled(button) && buttonTextPattern.test(button.textContent || "")) as
        | HTMLElement
        | undefined;

const selectUploadFile = (filePath: string, fileName: string, mimeType: string): void => {
    cy.readFile(filePath, null).then((fileBuffer) => {
        expect((fileBuffer as Uint8Array).byteLength, `${fileName} test file should not be empty`).to.be.greaterThan(0);

        cy.get('input[type="file"]').first().selectFile(
            {
                contents: fileBuffer,
                fileName,
                mimeType,
                lastModified: Date.now(),
            },
            { force: true }
        );
    });
};

const clickStartOcr = (): void => {
    cy.get("body").then(($body) => {
        const startOcrButton = getVisibleEnabledButton($body, /start\s*ocr/i);

        if (!startOcrButton) {
            throw new Error("Start OCR button should be enabled after a valid image upload.");
        }

        cy.wrap(startOcrButton).click({ force: true });
    });
};

const waitForOcrText = (attempt = 1): Cypress.Chainable<string> => {
    return cy.get("textarea", { timeout: 20000 }).then(($textarea) => {
        const extractedText = String($textarea.val() || "").trim();

        if (extractedText.length > 0) {
            return cy.wrap(extractedText);
        }

        if (attempt >= 60) {
            throw new Error("Expected OCR to generate text in the result textarea.");
        }

        cy.wait(1000);
        return waitForOcrText(attempt + 1);
    });
};

const appearsAcceptedByImageToText = ($body: JQuery<HTMLElement>): boolean => {
    const hasPreviewImage = $body
        .find("img:visible")
        .toArray()
        .some((img) => /blob:|data:image/i.test(img.getAttribute("src") || ""));
    const hasProcessingControl = Boolean(getVisibleEnabledButton($body, /start\s*ocr/i));
    const hasClearControl = Boolean(getVisibleEnabledButton($body, /^clear$/i));
    const hasLanguageSelector = $body.find("select:visible").length > 0;

    return hasPreviewImage || hasProcessingControl || hasClearControl || hasLanguageSelector;
};

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

        it("TC34: Verify Image to Text accepts text.jpg and generates extracted text", () => {
            toolPage.assertRouteLoaded("/image-to-text");

            selectUploadFile(textImagePath, "text.jpg", jpgMimeType);
            cy.get("img[alt='preview']").should("be.visible");
            cy.contains("button", /start\s*ocr/i).should("be.visible").and("not.be.disabled");

            clickStartOcr();

            waitForOcrText().then((extractedText) => {
                expect(extractedText, "OCR output should contain recognizable text from text.jpg").to.match(
                    expectedOcrTextPattern
                );
            });
        });

        it("TC35: Verify Image to Text rejects unsupported ZIP upload (7mb.zip)", () => {
            toolPage.assertNoResultByDefault();
            selectUploadFile(zipFilePath, "7mb.zip", zipMimeType);

            cy.wait(1200);

            cy.get("body").then(($body) => {
                expect(
                    appearsAcceptedByImageToText($body),
                    "7mb.zip must be blocked and must not expose Image to Text processing controls."
                ).to.eq(false);
            });
        });
    });
});
