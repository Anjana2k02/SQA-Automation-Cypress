import { ToolPage } from "../../pages/ToolPage";

describe("Functional - Editor and More Tools", () => {
    const toolPage = new ToolPage();

    it("FUN-008: PDF Editor and Image to Text pages load", () => {
        toolPage.visit("/pdf-editor");
        toolPage.assertRouteLoaded("/pdf-editor");
        toolPage.assertToolHasWorkingUiShell();

        toolPage.visit("/image-to-text");
        toolPage.assertRouteLoaded("/image-to-text");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("FUN-009: rotate, flip, meme and color picker pages are reachable", () => {
        ["/rotate-image", "/flip-image", "/meme-generator", "/color-picker"].forEach((route) => {
            toolPage.visit(route);
            toolPage.assertRouteLoaded(route);
            toolPage.assertToolHasWorkingUiShell();
        });
    });
});
