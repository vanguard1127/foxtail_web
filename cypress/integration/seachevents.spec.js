/// <reference types="Cypress" />
describe("The Events Page", function() {
  it("Login user 1", function() {
    cy.visit("/dev");
    cy.get("span")
      .contains("1")
      .click()
      .then(() => cy.location("pathname").should("include", "members"));
  });

  it("Change Events Search Settings", function() {
    cy.visit("/events");
    cy.get(".create-event-btn").click();
    cy.get("#eventname").type("Public Party");
    cy.get("#tagline").type("The kinda party you want to go to");
    cy.get("textarea").type(
      "OMG who reads anymore. Just go...wait. Is this 20 chars?"
    );
    cy.get(".select_kinks").click();
    cy.get(":nth-child(1) > .kink-tooltip > label > span").click();
    cy.get(":nth-child(2) > .kink-tooltip > label > span").click();
    cy.get(".kinks-select > .m-head > .close").click({ force: true });
    cy.get(":nth-child(5) > .select-container")
      .click()
      .get(".select-list > ul > :nth-child(1)")
      .click();
    cy.get("#next-btn").click();
  });
  it("Set Address and Time", function() {
    cy.get(
      ':nth-child(1) > .search > [style="display: flex;"] > #search-location'
    )
      .type("4545 Oregon St, San Diego, CA")
      .get(".autocomplete-dropdown-container > :nth-child(1) > span")
      .click();
    cy.get(
      ':nth-child(1) > .search > [style="display: flex;"] > #search-location'
    ).should("have.value", "4545 Oregon St, San Diego, California, USA");
    cy.get(
      ":nth-child(2) > .input > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
    ).click();
    cy.get(":nth-child(5) > :nth-child(5)").click();
    cy.get(".MuiPickersClock-squareMask").click();
    cy.get(".MuiPickersClock-squareMask").click();
    cy.get(
      ":nth-child(3) > .input > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
    ).click();
    cy.get(":nth-child(5) > :nth-child(6)").click();
    cy.get(".MuiPickersClock-squareMask").click();
    cy.get(".MuiPickersClock-squareMask").click();
    cy.get("#create-btn").click();
    cy.wait(5000);
  });
});
