import { ToolPage } from "../../pages/ToolPage";

describe("Functional - Document Converter", () => {
    const toolPage = new ToolPage();

    it("FUN-001: Image to PDF page loads with usable controls", () => {
        toolPage.visit("/image-to-pdf");
        toolPage.assertRouteLoaded("/image-to-pdf");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("FUN-002: PDF to Word page loads with usable controls", () => {
        toolPage.visit("/pdf-to-word");
        toolPage.assertRouteLoaded("/pdf-to-word");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("FUN-003: Word to PDF page loads with usable controls", () => {
        toolPage.visit("/word-to-pdf");
        toolPage.assertRouteLoaded("/word-to-pdf");
        toolPage.assertToolHasWorkingUiShell();
    });
});
