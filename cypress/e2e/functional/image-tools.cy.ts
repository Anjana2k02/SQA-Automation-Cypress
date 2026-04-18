import { ToolPage } from "../../pages/ToolPage";

describe("Functional - Image Tools", () => {
    const toolPage = new ToolPage();

    it("FUN-004: Resize Image page loads and shows controls", () => {
        toolPage.visit("/resize-image");
        toolPage.assertRouteLoaded("/resize-image");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("FUN-005: Crop Image page loads and shows controls", () => {
        toolPage.visit("/crop-image");
        toolPage.assertRouteLoaded("/crop-image");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("FUN-006: Compress and Convert pages load with controls", () => {
        toolPage.visit("/compress-image");
        toolPage.assertRouteLoaded("/compress-image");
        toolPage.assertToolHasWorkingUiShell();

        toolPage.visit("/convert-image");
        toolPage.assertRouteLoaded("/convert-image");
        toolPage.assertToolHasWorkingUiShell();
    });

    it("FUN-007: image conversion shortcuts load", () => {
        ["/convert-to-jpg", "/convert-to-png", "/convert-to-webp"].forEach((route) => {
            toolPage.visit(route);
            toolPage.assertRouteLoaded(route);
            toolPage.assertToolHasWorkingUiShell();
        });
    });
});
