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

Cypress.Commands.add("createContainer", (title, location, notes, recordTitlePrefix, userId) => {
    cy.switchUser(userId);
    cy.clearWorkTray();

    let recordNumbers = [];
    cy.createRecord("Subject", location, null, recordTitlePrefix + "1", ["CORPORATE AFFAIRS", "CONTRACTING"],
        "PUBLICATION - INVENTORY P5.I2.01", "CYRPESS-TEST", "CYPRESS TESTING", 500);
    cy.get("#recordNumberHeading")
        .then(recordNum => {
            recordNumbers.push(recordNum.text());
            cy.createRecord("Subject", location, null, recordTitlePrefix + "2", ["CORPORATE AFFAIRS", "CONTRACTING"],
                "PUBLICATION - INVENTORY P5.I2.01", "CYRPESS-TEST", "CYPRESS TESTING", 500);

            cy.get("#recordNumberHeading")
                .then(recordNum => {
                    recordNumbers.push(recordNum.text());

                    cy.addRecordsToWorkTray(recordNumbers);

                    cy.actionOnAllWorktrayItems("Contain");

                    cy.get("#formTitle").type(title);
                    cy.get("select#formLocation").select(location);
                    if (notes != null) {
                        cy.get("#formNotes").type(notes);
                    }
                    cy.contains("Submit").click();
                })
        })
});


Cypress.Commands.add("clearWorkTray", () => {
    cy.contains("Work Tray").click();
    cy.contains("All").click();
});

Cypress.Commands.add("addRecordsToWorkTray", (recordNumbers) => {
    recordNumbers.forEach(num => {
        cy.visit("/");
        cy.get('input').type(num + '{enter}');
        cy.get(":nth-child(1) > .rt-tr > > input").click();
        cy.contains("Add to Tray").click();
    });
});

Cypress.Commands.add("actionOnAllWorktrayItems", (actionButtonText) => {
    cy.contains("Work Tray").click();
    cy.get(".rt-th > div > input").click();
    cy.contains(actionButtonText).click();
});

Cypress.Commands.add("goToRecord", (recordNumber) => {
        cy.visit("/");
        cy.get('input').type(recordNumber + '{enter}');
        cy.get(":nth-child(1) > .rt-tr > :nth-child(3) > div > a").click();
});

Cypress.Commands.add("goToContainer", (containerNumber) => {
    cy.visit("/");
    cy.get('input').type(containerNumber + '{enter}');
    cy.get("select#filterSelect").select("Containers");
    cy.get(":nth-child(1) > .rt-tr > :nth-child(3) > div > a").click();
});
