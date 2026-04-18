import { HomePage } from "../../pages/HomePage";

describe("Homepage Smoke", () => {
    const homePage = new HomePage();

    it("loads the homepage successfully", () => {
        homePage.visit();
        homePage.assertPageLoaded();
        homePage.assertCoreSectionsVisible();
    });

    it("has a non-empty and meaningful page title", () => {
        homePage.visit();

        cy.fixture("testData").then((data) => {
            cy.title().then((title) => {
                expect(title.trim().length).to.be.greaterThan(0);
                expect(title.length).to.be.lessThan(data.maxTitleLength);

                const normalized = title.toLowerCase();
                const hasKeyword = data.expectedKeywords.some((keyword: string) =>
                    normalized.includes(keyword)
                );
                expect(hasKeyword).to.eq(true);
            });
        });
    });
});
