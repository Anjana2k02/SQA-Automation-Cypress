declare namespace Cypress {
  interface Chainable {
    getByDataCy(value: string): Chainable<JQuery<HTMLElement>>;
  }
}

export {};
