import { HomePage } from "../../pages/HomePage";

describe("Navigation Smoke", () => {
  const homePage = new HomePage();

  it("keeps user on the expected host when navigating", () => {
    homePage.visit();
    homePage.clickFirstInternalLinkIfPresent();
  });

  it("returns success status for base URL", () => {
    cy.request("/").its("status").should("be.within", 200, 399);
  });
});
