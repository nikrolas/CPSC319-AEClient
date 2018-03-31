describe('createContainer', function () {
    beforeEach(function () {
        cy.visit('/');
    });

    it('should create a new container', function () {
        cy.createRecord("Subject", "Burnaby", null, "Cypress-Create Record For Container", ["CORPORATE AFFAIRS","CONTRACTING"], "PUBLICATION - INVENTORY P5.I2.01", "CYRPESS-TEST", "CYPRESS TESTING", 500);

    });
});
