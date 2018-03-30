describe('permissions', function () {
    beforeEach(function () {
        cy.visit('http://localhost:3000');
    });

    it('should be able to switch users', function() {
        cy.switchUser(50);

        cy.switchUser(101);

        cy.switchUser(500);
    })
});
