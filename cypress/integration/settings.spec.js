/// <reference types="Cypress" />
describe("The Settings Page", function() {
  it("Login user 1", function() {
    cy.visit("/dev");
    cy.get("span")
      .contains("1")
      .click()
      .then(() => cy.location("pathname").should("include", "members"));
  });
  it("Change Settings", function() {
    cy.visit("/settings");
    cy.get(".select_kinks > ul").click();
    cy.get(":nth-child(1) > .kink-tooltip > label > span").click();
    cy.get(":nth-child(2) > .kink-tooltip > label > span").click();
    cy.get(
      "div.layout section.settings section.kinks-popup.show div.modal-popup.kinks-select div.m-head > span.close"
    ).click({ force: true });
    // cy.get(".select_kinks > ul")
    //   .find("li")
    //   .should("have.length", 3);
    cy.get(".bio")
      .clear()
      .type("Ive been test and I know that means I work...but Do I?");
    // .should(
    //   "have.text",
    //   "Ive been test and I know that means I work...but Do I?"
    // );
    cy.get(":nth-child(4) > .item > .select-container")
      .click()
      .get(".select-list > ul > :nth-child(2)")
      .click();
    cy.get(
      ":nth-child(4) > .content > .row > :nth-child(4) > .item > .switch-con > .sw-btn > .switch > label"
    ).click();
    cy.contains("Interested In:")
      .as("interested")
      .click({ force: true });
    cy.contains("Female").click();
    cy.get("@interested").click();

    cy.get(":nth-child(2) > .item > .rc-slider ").click();
    cy.get(":nth-child(3) > .item > .rc-slider").click();
    //Need to figure out file upload
    // cy.get(
    //   ":nth-child(2) > .content > .row > :nth-child(2) > .header-container > .box > .rc-upload > .upload-box"
    // ).click({ force: true });
  });
  it("Try to change location as free user", function() {
    cy.get(".location-search-input").type("Atlanta");
    cy.get(".location-search-input").should(
      "have.value",
      "San Diego, California, US"
    );
  });

  it("App Settings", function() {
    cy.get(
      ":nth-child(3) > .item > .switch-con > .sw-btn > .switch > label"
    ).click();
    cy.get(
      ":nth-child(5) > .content > .row > :nth-child(4) > .item > .switch-con > .sw-btn > .switch > label"
    ).click();
    cy.get(":nth-child(2) > .item > .select-container")
      .click()
      .get(".select-list > ul > :nth-child(1) ")
      .click();
  });
});
