export const MAX_IMAGE_UPLOAD_BYTES = 20 * 1024 * 1024;

const rejectionStatusSelectors = [
    "[role='alert']",
    "[aria-live]",
    "[class*='alert']",
    "[class*='danger']",
    "[class*='error']",
    "[class*='invalid']",
    "[class*='notification']",
    "[class*='toast']",
].join(", ");

const normalizeText = (value: string): string =>
    value.replace(/\s+/g, " ").trim().toLowerCase();

const fileSizeRejectionPattern =
    /too large|exceed(?:s|ed)?|larger than|more than\s*20\s*mb|over\s*20\s*mb|file size (?:is )?(?:invalid|too large)|maximum file size exceeded/;

const statusRejectionPattern =
    /too large|exceed(?:s|ed)?|max(?:imum)? file size|size limit|20\s*mb|must be (?:less|under)/;

const getStatusText = ($body: JQuery<HTMLElement>): string =>
    normalizeText(
        $body
            .find(rejectionStatusSelectors)
            .toArray()
            .map((element) => element.textContent || "")
            .join(" ")
    );

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

export const hasFileSizeRejection = ($body: JQuery<HTMLElement>): boolean => {
    const pageText = normalizeText($body.text());
    const statusText = getStatusText($body);

    return fileSizeRejectionPattern.test(pageText) || statusRejectionPattern.test(statusText);
};

export const appearsAcceptedForProcessing = ($body: JQuery<HTMLElement>): boolean => {
    const hasVisibleDownloadAction =
        $body.find("a[download]:visible").length > 0 ||
        hasVisibleEnabledButton($body, /download/i);

    const hasImagePreview = $body
        .find("img:visible")
        .toArray()
        .some((img) => /blob:|data:image/i.test(img.getAttribute("src") || ""));

    const hasResizeOutputControls =
        $body.find("input:visible").length >= 2 &&
        hasVisibleEnabledButton($body, /download|resize|process/i);

    return hasVisibleDownloadAction || hasImagePreview || hasResizeOutputControls;
};

export const selectImageFile = (filePath: string, fileName: string): void => {
    cy.readFile(filePath, null).then((fileBuffer) => {
        cy.get('input[type="file"]').first().selectFile(
            {
                contents: fileBuffer,
                fileName,
                mimeType: "image/jpeg",
                lastModified: Date.now(),
            },
            { force: true }
        );
    });
};
