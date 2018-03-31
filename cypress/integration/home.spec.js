describe('home', function () {
    beforeEach(function () {
        cy.visit('/');
    });

    it('should have search input', function () {
        cy.get('input')
            .should('have.attr', 'placeholder', 'Search by record number. e.g. VAN')
            .type('345')
            .should('have.value', '345');
    });

    describe('nav bar', function () {
        it('should have search', function () {
            cy.contains('Search').click();
            cy.url().should('include', '/results');
        });
        it('should have work tray', function () {
            cy.contains('Work Tray').click();
            cy.url().should('include', '/worktray');
        });
        it('should have new record', function () {
            cy.contains('New Record').click();
            cy.url().should('include', '/createRecord');
        });
    });
});
