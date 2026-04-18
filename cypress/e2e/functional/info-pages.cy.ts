import { AppShellPage } from "../../pages/AppShellPage";

describe("Functional - Information and Policy Pages", () => {
    const appShell = new AppShellPage();

    it("FUN-010: info and legal pages are reachable", () => {
        ["/about", "/contact", "/privacy", "/terms", "/disclaimer"].forEach((route) => {
            appShell.visitPath(route);
            appShell.assertAppIsRendered();
            appShell.assertBasicPageSemantics();
        });
    });
});
