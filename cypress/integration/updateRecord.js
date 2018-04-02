describe('updateRecord', function () {
    beforeEach(function () {
        cy.visit('/');
    });

    it('should update a new record', function () {
        cy.createRecord("Subject", "Burnaby", null, "Cypress-Create Record", ["CORPORATE AFFAIRS","CONTRACTING"], "PUBLICATION - INVENTORY P5.I2.01", "CYPRESS-TEST", "CYPRESS TESTING", 500);
        cy.get("#edit").click();
        cy.get("#formTitleText").clear().type("Updated Cypress Record");
        cy.get(".btn-group > :nth-child(2)").click();
        let classifications = ["ADVISORY SERVICES","ADVICE", "Background"]
        classifications.forEach(c => {
            cy.get("#formClassification").select(c);
        });
        cy.get("input.rbt-input-main").click().clear().type("CORPORATE AFFAIRS - INCORPORATION C2.I1.00");
        cy.get(".rbt-highlight-text").first().click();
        cy.get("#formState").select("Inactive");
        cy.get("#formConsignmentCode").clear().type("Updated Cypress Test");
        cy.get("#formNotes").clear().type("Updated Cypress Test");
        cy.contains("Submit").click();
        cy.contains("Updated Cypress Record");
        cy.contains("CORPORATE AFFAIRS - INCORPORATION(1)");
        cy.contains("ADVISORY SERVICES/ADVICE/Background");
        cy.contains("Inactive");
    });
});
