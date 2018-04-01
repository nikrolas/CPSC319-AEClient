describe('delete', function () {
    beforeEach(function () {
        cy.visit('/');
    });

    it('should not be able to delete a non-empty container', function () {
        cy.createContainer("CYPRESS - deleteContainer", "Edmonton", "Cypress - delete", "Cypress-recordForDeletion", 500);

        cy.get("#containerNumberHeading")
            .then(containerNum => {
                cy.clearWorkTray();
                cy.addContainersToWorkTray([containerNum.text()]);
                cy.actionOnAllWorktrayItems("Delete");
                cy.contains("Confirm").click();
                cy.contains("The container(s) are not empty and still contain records");

                cy.goToContainer(containerNum.text());
                cy.contains("Delete").click();
                cy.get(".modal-footer > .btn-danger").click();
                cy.contains("The container(s) are not empty and still contain records");
            });
    });

    it('should not be able to delete a non-empty container', function () {
        let containerNumbers = [];
        let recordNumbers = [];
        cy.createContainer("CYPRESS - deleteContainer", "Edmonton", "Cypress - delete", "Cypress-recordForDeletion", 500);

        cy.get("#containerNumberHeading")
            .then(containerNum => {
                containerNumbers.push(containerNum.text());
                cy.get(":nth-child(1) > .rt-tr > > div > a")
                    .then(firstRecordNumber => {
                        recordNumbers.push(firstRecordNumber.text());

                        cy.get(":nth-child(2) > .rt-tr > > div > a")
                            .then(secondRecordNumber => {
                                recordNumbers.push(secondRecordNumber.text());

                                cy.goToContainer(containerNumbers[0]);
                                cy.contains("Delete").click();
                                cy.get(".modal-footer > .btn-danger").click();
                                cy.contains("The container(s) are not empty and still contain records");


                                cy.goToRecord(recordNumbers[0]);
                                cy.contains("Delete").click();
                                cy.get(".modal-footer > .btn-danger").click();
                                cy.contains("This record has been successfully deleted.");

                                cy.addContainersToWorkTray([containerNum.text()]);

                                cy.actionOnAllWorktrayItems("Delete");
                                cy.url().should('include', '/confirmAction');
                                cy.contains("Confirm").click();
                                cy.contains("Successfully deleted the records and containers.");

                                cy.visit('/worktray');
                                cy.contains("No rows found");
                            });
                    });
            });
    });

    it('should not be able to delete a items outside of authorized locations', function () {
        cy.createContainer("CYPRESS - deleteContainer", "Edmonton", "Cypress - delete", "Cypress-recordForDeletion", 500);

        cy.get("#containerNumberHeading")
            .then(containerNum => {
                cy.goToContainer(containerNum.text());
                cy.contains("Delete").click();
                cy.get(".modal-footer > .btn-danger").click();
                cy.contains("You do not have permission to delete container 2018/077-EDM from your location.");

                cy.get("#containerNumberHeading")
                    .then(containerNum => {
                        containerNumbers.push(containerNum.text());
                        //Click on first record number
                        cy.get(":nth-child(1) > .rt-tr > > div > a").click();
                        cy.contains("Delete").click();
                        cy.get(".modal-footer > .btn-danger").click();
                        cy.contains("You do not have permission to delete records in Edmonton.");
                    });
            });
    });
});
