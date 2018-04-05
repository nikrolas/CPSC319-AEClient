describe('search', function () {
    beforeEach(function () {
        cy.visit("/");
        cy.switchUser(500);
    });

    it('should search with enter input', function () {
        cy.get('input')
            .should('have.attr', 'placeholder', 'Search by record number. e.g. VAN')
            .type('345{enter}');
        cy.get('input').should('have.value', '345');
    });

    it('should search with click', function () {
        cy.get('input')
            .should('have.attr', 'placeholder', 'Search by record number. e.g. VAN')
            .type('345')
            .should('have.value', '345');
        cy.get('button').click();
        cy.get('input').should('have.value', '345');
    });

    it('should return results', function () {
        cy.server();
        cy.route("**", 'fixture:results.json').as('getComment');

        cy.get('input')
            .should('have.attr', 'placeholder', 'Search by record number. e.g. VAN')
            .type('345{enter}');

        cy.wait('@getComment').should(function (response) {
            expect(response.status).to.eq(200);
            expect(response.responseBody.length).to.be.greaterThan(0);
            expect(response.responseBody[0].title).to.eq("Test title 1");
        });
    });

});
