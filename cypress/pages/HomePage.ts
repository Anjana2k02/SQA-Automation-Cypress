export class HomePage {
    visit(): void {
        cy.visit("/");
    }

    assertPageLoaded(): void {
        cy.get("body").should("be.visible");
        cy.location("hostname").should("contain", "pixelssuite.com");
    }

    assertCoreSectionsVisible(): void {
        cy.get("body").should("not.be.empty");
        cy.get("a:visible").its("length").should("be.gte", 1);
        cy.title().should("not.be.empty");
    }

    getInternalLinks(): Cypress.Chainable<JQuery<HTMLAnchorElement>> {
        return cy.get('a[href^="/"]').filter(":visible") as Cypress.Chainable<
            JQuery<HTMLAnchorElement>
        >;
    }

    clickFirstInternalLinkIfPresent(): void {
        this.getInternalLinks().then(($links) => {
            if ($links.length > 0) {
                cy.wrap($links[0]).click({ force: true });
                cy.location("hostname").should("contain", "pixelssuite.com");
            } else {
                cy.log("No internal links were found to click on this page.");
            }
        });
    }
}
