import { ToolPage } from "../../pages/ToolPage";

describe("Smoke - Route Reachability", () => {
    const toolPage = new ToolPage();

    it("SMK-004: loads major feature routes without error", () => {
        const majorRoutes = [
            "/image-to-pdf",
            "/resize-image",
            "/compress-image",
            "/convert-image",
            "/pdf-editor",
            "/image-to-text",
            "/meme-generator",
        ];

        majorRoutes.forEach((route) => {
            toolPage.visit(route);
            toolPage.assertRouteLoaded(route);
            toolPage.assertToolHasWorkingUiShell();
        });
    });

    it("SMK-005: transliteration is intentionally excluded from this suite", () => {
        cy.fixture("routes").then((routes) => {
            expect(routes.excluded).to.include("/transliteration");
            expect(routes.excluded).to.include("/chat-translator");
        });
    });
});
