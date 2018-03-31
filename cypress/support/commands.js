// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("switchUser", (userId) => {
    cy.location().then(loc => {
        let location = loc;
        let pathWithoutParams = location.origin + location.pathname;
        cy.visit(pathWithoutParams + "?userId=" + userId);
    });
});

Cypress.Commands.add("createRecord", (recordType, location, recordNumber, title, classifications, schedule, consignmentCode, notes, userId) => {
    cy.visit("/createRecord?userId=" + userId);
    cy.get("select#formRecordType").select(recordType);
    cy.get("select#formLocation").select(location);
    cy.get("#suggestedRecordNum").then(recordNum => {
        let transformedRecordNumber = recordNum.text();
        transformedRecordNumber.replace("X", "A");
        transformedRecordNumber.replace("Z", "A");
        transformedRecordNumber.replace("N", "1");
        if (recordNumber == null) {
            cy.get("#formRecordNumber").type(transformedRecordNumber);
        } else {
            cy.get("input#formRecordNumber").type(recordNumber);
        }
        cy.get("#formTitle").type(title);

        classifications.forEach(c => {
            cy.get("#formClassification").select(c);
        });

        cy.get("input.rbt-input-main").click().type(schedule);
        cy.get(".rbt-highlight-text").first().click();

        if (consignmentCode != null) {
            cy.get("#formConsignmentCode").type(consignmentCode);
        }

        if (notes != null) {
            cy.get("#formNotes").type(notes);
        }

        cy.contains("Submit").click();
    })
});

Cypress.Commands.add("createContainer", (title, location, notes, userId) => {
    cy.createRecord("Subject", "Burnaby", null, "Cypress-Create Record For Container", ["CORPORATE AFFAIRS","CONTRACTING"], "PUBLICATION - INVENTORY P5.I2.01", "CYRPESS-TEST", "CYPRESS TESTING", 500);
    cy.visit("/search?userId=" + userId);
})