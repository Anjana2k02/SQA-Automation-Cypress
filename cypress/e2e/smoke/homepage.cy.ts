import { AppShellPage } from "../../pages/AppShellPage";

describe("Smoke - Homepage", () => {
    const appShell = new AppShellPage();

    it("SMK-001: loads homepage and renders key shell", () => {
        appShell.visitHome();
        appShell.assertAppIsRendered();
        appShell.assertBasicPageSemantics();
    });

    it("SMK-002: shows primary navigation labels", () => {
        appShell.visitHome();

        appShell.assertTopLevelNavContains([
            "Document Converter",
            "Editor",
            "Resize",
            "Crop",
            "Compress",
            "Image Converter",
            "More",
        ]);
    });

    it("SMK-003: has stable page title and links", () => {
        appShell.visitHome();

        cy.title().should("not.be.empty");
        cy.get("a").its("length").should("be.gte", 3);
    });
});
