import { ToolPage } from "../../../pages/ToolPage";
import { hasFileSizeRejection } from "../../../support/fileUploadAssertions";

const wordDocumentPath = "cypress/e2e/document/word.docx";
const oversizedWordDocumentPath = "cypress/e2e/document/40mb.docx";
const maxDocumentUploadBytes = 20 * 1024 * 1024;
const wordMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const isDisabled = (element: Element): boolean =>
    element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";

const getVisibleEnabledButton = (
    $body: JQuery<HTMLElement>,
    actionPattern: RegExp
): HTMLElement | undefined =>
    $body
        .find("button:visible")
        .toArray()
        .find((element) => !isDisabled(element) && actionPattern.test(element.textContent || "")) as
        | HTMLElement
        | undefined;

const hasDownloadControl = ($body: JQuery<HTMLElement>): boolean =>
    $body.find("a[download]:visible").length > 0 ||
    Boolean(getVisibleEnabledButton($body, /download/i));

const clickDownloadAction = (): Cypress.Chainable<JQuery<HTMLBodyElement>> => {
    return cy.get("body").then(($body) => {
        const downloadLink = $body.find("a[download]:visible").first();
        const downloadLinkElement = downloadLink.get(0);
        const downloadButton = getVisibleEnabledButton($body, /download/i);
        const downloadAction = downloadLinkElement || downloadButton;

        if (!downloadAction) {
            throw new Error("A download action should be available after conversion.");
        }

        cy.wrap(downloadAction).click({ force: true });
    });
};

const getDownloadedPdfs = (files: string[]): string[] =>
    files.filter((fileName) => /\.pdf$/i.test(fileName));

const waitForDownloadedPdf = (attempt = 1): Cypress.Chainable<string[]> => {
    return cy.task<string[]>("downloadedFiles").then((files) => {
        const downloadedPdfs = getDownloadedPdfs(files);

        if (downloadedPdfs.length > 0) {
            return cy.wrap(downloadedPdfs);
        }

        if (attempt >= 20) {
            throw new Error("Expected a converted PDF file to be downloaded.");
        }

        cy.wait(500);
        return waitForDownloadedPdf(attempt + 1);
    });
};

const waitForDownloadedPdfOrDownloadAction = (attempt = 1): Cypress.Chainable<string[]> => {
    return cy.task<string[]>("downloadedFiles").then((files) => {
        const downloadedPdfs = getDownloadedPdfs(files);

        if (downloadedPdfs.length > 0) {
            return cy.wrap(downloadedPdfs);
        }

        return cy.get("body").then(($body) => {
            if (hasDownloadControl($body)) {
                return clickDownloadAction().then(() => waitForDownloadedPdf());
            }

            if (attempt >= 20) {
                throw new Error("Expected conversion to create a PDF download or expose a download action.");
            }

            cy.wait(500);
            return waitForDownloadedPdfOrDownloadAction(attempt + 1);
        });
    });
};

describe("Feature 1: Document Converter", () => {
    const toolPage = new ToolPage();

    describe("Sub-feature: Image to PDF", () => {
        beforeEach(() => {
            toolPage.visit("/image-to-pdf");
        });

        it("TC01: Verify Image to PDF converter loads and contains valid UI controls", () => {
            toolPage.assertRouteLoaded("/image-to-pdf");
            toolPage.assertToolHasWorkingUiShell();
            
            // Additional functional checks for the UI
            cy.contains(/image\s*→?\s*pdf/i).should("be.visible");
            cy.contains(/drag and drop your file/i).should("exist");
        });

        it("TC04: Verify empty/initial state has no download actions exposed", () => {
            toolPage.assertNoResultByDefault();
        });

        it("TC05: Verify error handling/negative test when invalid file type is uploaded", () => {
            toolPage.tryInvalidUploadIfAvailable();
            cy.get("body").should("be.visible");
        });
    });

    describe("Sub-feature: PDF to Word", () => {
        beforeEach(() => {
            toolPage.visit("/pdf-to-word");
        });

        it("TC02: Verify PDF to Word converter loads and contains valid UI controls", () => {
            toolPage.assertRouteLoaded("/pdf-to-word");
            toolPage.assertToolHasWorkingUiShell();
            
            // Additional functional checks for the UI
            cy.contains(/pdf\s*→?\s*word/i).should("be.visible");
            cy.contains(/drag and drop your file/i).should("exist");
        });

        it("TC06: Verify empty/initial state has no download actions exposed", () => {
            toolPage.assertNoResultByDefault();
        });
    });

    describe("Sub-feature: Word to PDF", () => {
        beforeEach(() => {
            toolPage.visit("/word-to-pdf");
        });

        it("TC03: Verify Word to PDF converter loads and contains valid UI controls", () => {
            toolPage.assertRouteLoaded("/word-to-pdf");
            toolPage.assertToolHasWorkingUiShell();
            
            // Additional functional checks for the UI
            cy.contains(/word\s*→?\s*pdf/i).should("be.visible");
            cy.contains(/drag and drop your file/i).should("exist");
        });

        it("TC07: Verify empty/initial state has no download actions exposed", () => {
            toolPage.assertNoResultByDefault();
        });

        it("TC08: Verify Word document upload, conversion, and PDF download", () => {
            cy.task("clearDownloads");
            toolPage.assertRouteLoaded("/word-to-pdf");

            cy.readFile(wordDocumentPath, null).then((fileBuffer) => {
                expect((fileBuffer as Uint8Array).byteLength, "word.docx test file should not be empty").to.be.greaterThan(
                    0
                );

                cy.get('input[type="file"]').first().selectFile(
                    {
                        contents: fileBuffer,
                        fileName: "word.docx",
                        mimeType: wordMimeType,
                        lastModified: Date.now(),
                    },
                    { force: true }
                );
            });

            cy.get("body").should(($body) => {
                const pageText = $body.text().toLowerCase();
                const hasUploadedFileName = pageText.includes("word.docx");
                const hasConversionControl = Boolean(
                    getVisibleEnabledButton($body, /convert\s*to\s*pdf|create\s*pdf|download/i)
                );

                expect(
                    hasUploadedFileName || hasConversionControl,
                    "Word upload should be accepted and expose conversion or download controls."
                ).to.eq(true);
            });

            cy.get("body").then(($body) => {
                const conversionAction = getVisibleEnabledButton(
                    $body,
                    /convert\s*to\s*pdf|create\s*pdf/i
                );

                if (conversionAction) {
                    cy.wrap(conversionAction).click({ force: true });
                }
            });

            waitForDownloadedPdfOrDownloadAction().then((downloadedPdfs) => {
                expect(downloadedPdfs, "A converted PDF should be downloaded.").not.to.be.empty;

                cy.readFile(`cypress/downloads/${downloadedPdfs[0]}`, null).then((downloadedFile) => {
                    expect(
                        (downloadedFile as Uint8Array).byteLength,
                        "Downloaded PDF should not be empty."
                    ).to.be.greaterThan(0);
                });
            });
        });

        it("TC09: Verify Word document larger than 20MB is rejected", () => {
            cy.task("clearDownloads");
            toolPage.assertRouteLoaded("/word-to-pdf");

            cy.readFile(oversizedWordDocumentPath, null).then((fileBuffer) => {
                expect(
                    (fileBuffer as Uint8Array).byteLength,
                    "40mb.docx test file must be larger than 20MB"
                ).to.be.greaterThan(maxDocumentUploadBytes);

                cy.get('input[type="file"]').first().selectFile(
                    {
                        contents: fileBuffer,
                        fileName: "40mb.docx",
                        mimeType: wordMimeType,
                        lastModified: Date.now(),
                    },
                    { force: true }
                );
            });

            cy.wait(1200);

            cy.get("body").then(($body) => {
                const hasRejectionMessage = hasFileSizeRejection($body);
                const hasAcceptedAction =
                    Boolean(getVisibleEnabledButton($body, /convert\s*to\s*pdf|create\s*pdf/i)) ||
                    hasDownloadControl($body);

                expect(
                    hasAcceptedAction,
                    "40mb.docx must not expose conversion or download controls."
                ).to.eq(false);

                expect(
                    hasRejectionMessage,
                    "40mb.docx must show file-size validation feedback."
                ).to.eq(true);
            });

            cy.task<string[]>("downloadedFiles").then((files) => {
                expect(
                    getDownloadedPdfs(files),
                    "No PDF should be downloaded for a document larger than 20MB."
                ).to.be.empty;
            });
        });
    });
});
