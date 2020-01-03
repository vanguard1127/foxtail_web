/// <reference types="Cypress" />
describe("The Search Page", function() {
  it("Login Dev 1", function() {
    // now that we're logged in, we can visit
    // any kind of restricted route!
    cy.visit("/dev");
    cy.get("span")
      .contains("1")
      .click();
    cy.get(".select-container").click();
    cy.get(".select-list > ul > :nth-child(1)").click();
    cy.get(".select-list > ul > :nth-child(3)").click();
    cy.get(".select-container").click();
  });

  it("See Selected Type Profiles", function() {
    cy.get(
      "div.layout main:nth-child(2) section.members div.container div.col-md-12 > div.row"
    )
      .find(".card-item")
      .should("have.length", 5);
  });

  it("Try to change location as free user", function() {
    cy.get(".location-search-input").type("Atlanta");
    cy.get(".location-search-input").should(
      "have.value",
      "San Diego, California, US"
    );
  });

  it("Like User", function() {
    cy.get(":nth-child(2) > .card-item > .info > .function > .heart").click();
    cy.get(":nth-child(2) > .card-item > .info > .function > .unheart").should(
      "exist"
    );
  });

  it("UnLike User", function() {
    cy.get(":nth-child(2) > .card-item > .info > .function > .unheart").click();
    cy.get(":nth-child(2) > .card-item > .info > .function > .heart").should(
      "exist"
    );
  });

  //Slider not working
  // it("Change distance", function() {
  //   cy.get(":nth-child(3) > .item > .rc-slider > .rc-slider-handle")
  //     .trigger("mousedown", { which: 1 })
  //     .trigger("mousemove", { clientX: 0, clientY: 0 })
  //     .trigger("mouseup", { force: true });
  // });

  // it("Select All", function() {
  //   // now that we're logged in, we can visit
  //   // any kind of restricted route!

  //   cy.get(".select-container").click();
  //   cy.get(".select-list > ul > :nth-child(1)").click();
  //   cy.get(".select-list > ul > :nth-child(3)").click();
  //   cy.get(".select-container").click();
  // });
});
