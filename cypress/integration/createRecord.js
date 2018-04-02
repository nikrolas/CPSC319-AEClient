describe('createRecord', function () {
    beforeEach(function () {
        cy.visit('/');
    });

    it('should create a new record', function () {
        cy.createRecord("Subject", "Burnaby", null, "Cypress-Create Record", ["CORPORATE AFFAIRS","CONTRACTING"], "PUBLICATION - INVENTORY P5.I2.01", "CYPRESS-TEST", "CYPRESS TESTING", 500);
    });
});
