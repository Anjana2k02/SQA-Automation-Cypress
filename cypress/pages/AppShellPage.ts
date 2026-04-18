export class AppShellPage {
  visitHome(): void {
    cy.visit("/");
  }

  visitPath(path: string): void {
    if (path === "/") {
      cy.visit("/");
      return;
    }

    cy.visit("/");
    cy.window().then((win) => {
      win.history.pushState({}, "", path);
      win.dispatchEvent(new win.PopStateEvent("popstate"));
    });
    cy.location("pathname").should("eq", path);
  }

  assertAppIsRendered(): void {
    cy.get("body").should("be.visible");
    cy.get("body").should("not.be.empty");
    cy.location("hostname").should("include", "pixelssuite.com");
  }

  assertBasicPageSemantics(): void {
    cy.get("h1, h2").its("length").should("be.gte", 1);
    cy.get("a").its("length").should("be.gte", 5);
  }

  assertTopLevelNavContains(labels: string[]): void {
    labels.forEach((label) => {
      cy.contains("a, button", new RegExp(label, "i")).should("be.visible");
    });
  }
}
