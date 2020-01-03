/// <reference types="Cypress" />
describe("The Home Page", function() {
  before(function() {
    cy.request("GET", "http://localhost:4444/reset", {
      key: "Qu1zll113"
    }).then(response => {
      // response.body is automatically serialized into JSON
      expect(response.body).to.eq(true);
    });
  });

  it("Create Account", function() {
    // now that we're logged in, we can visit
    // any kind of restricted route!
    cy.visit("/");
    cy.get("input[name=username]").type("TestUser");
    cy.get("input[name=email]").type("cecilcjcarter@gmail.com");
    cy.get("input[name=birthday]").click();
    cy.get(".MuiPickersYearSelection-container").click();
    cy.get(".MuiPickersMonthSelection-container").click();
    cy.get(".MuiPickersBasePicker-pickerView").click();
    cy.contains("Sex:").click();
    cy.contains("Male").click();
    cy.contains("Interested In:").click({ force: true });
    cy.contains("Female").click();
    cy.contains("Interested In:").click({ force: true });
    cy.contains("Get Started").click();
    cy.get("input[type=tel]").type("6786337945");
    cy.contains("Send verification code").click();
    cy.get("input[name=vcode]").type("123456");
    cy.contains("Confirm Phone Number").click();
  });
  // it("Login to Account", function() {
  //   // now that we're logged in, we can visit
  //   // any kind of restricted route!
  //   cy.visit("/");
  //   cy.contains("Login").click();
  //   cy.get("input[type=tel]").type("6786337945");
  //   cy.contains("Send verification code").click();
  //   cy.get("input[name=vcode]").type("123456");
  //   cy.contains("Confirm Phone Number").click();
  // });
});
