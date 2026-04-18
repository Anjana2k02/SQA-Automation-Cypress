Cypress.Commands.add("getByDataCy", (value: string) => {
    return cy.get(`[data-cy="${value}"]`);
});

Cypress.Commands.add("visitAndAssert", (path: string) => {
    cy.visit(path);
    cy.location("pathname").should("eq", path);
    cy.get("body").should("be.visible");
});

Cypress.Commands.add("assertAnySelectorExists", (selectors: string[]) => {
    cy.get("body").then(($body) => {
        const hasAtLeastOneSelector = selectors.some((selector) =>
            $body.find(selector).length > 0
        );

        expect(hasAtLeastOneSelector).to.eq(true);
    });
});
