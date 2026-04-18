declare namespace Cypress {
    interface Chainable {
        getByDataCy(value: string): Chainable<JQuery<HTMLElement>>;
        visitAndAssert(path: string): Chainable<void>;
        assertAnySelectorExists(selectors: string[]): Chainable<void>;
    }
}

export { };
