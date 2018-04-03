describe('createContainer', function () {
    beforeEach(function () {
        cy.visit('/');
    });

    it('should create a new container', function () {
        cy.createContainer("CYPRESS - createContainer1", "Edmonton", "Cypress - destroy", "Cypress-recordForDestruction", 500);

    });

    it('should create multiple containers', function () {
        cy.createContainer("CYPRESS - createContainer1", "Edmonton", "Cypress - destroy", "Cypress-recordForDestruction", 500);
        cy.createContainer("CYPRESS - createContainer2", "Edmonton", "Cypress - destroy", "Cypress-recordForDestruction", 500);
        cy.createContainer("CYPRESS - createContainer3", "Edmonton", "Cypress - destroy", "Cypress-recordForDestruction", 500);

    });
});
