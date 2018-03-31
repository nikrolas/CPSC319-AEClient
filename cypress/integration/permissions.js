describe('permissions', function () {
    beforeEach(function () {
        cy.visit('/');
    });

    it('should be able to switch users', function() {
        cy.switchUser(50);

        cy.switchUser(101);

        cy.switchUser(500);
    })
});
