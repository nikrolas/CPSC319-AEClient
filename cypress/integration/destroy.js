describe('destroy', function () {
    beforeEach(function () {
        cy.visit('/');
    });

    it('should be able to destroy containers and closed records and delete containers', function () {
        cy.createContainer("CYPRESS - destroy", "Edmonton", "Cypress - destroy", "Cypress-recordForDestruction", 500);

        //View first record in contained records table
        cy.get(":nth-child(1) > .rt-tr > > div > a").click();
        cy.contains("Remove From Container").click();
        cy.get(".modal-footer > .btn-danger").click();

        cy.get("#recordNumberHeading")
            .then(recordNum => {
                cy.addRecordsToWorkTray([recordNum.text()]);

                cy.createContainer("CYPRESS - destroy", "Edmonton", "Cypress - destroy", "Cypress-recordForDestruction", 500);

                //View first record in contained records table
                cy.get(":nth-child(1) > .rt-tr > > div > a").click();
                cy.contains("Remove From Container").click();
                cy.get(".modal-footer > .btn-danger").click();

                cy.get("#recordNumberHeading")
                    .then(recordNum => {
                        cy.addRecordsToWorkTray([recordNum.text()]);
                        cy.actionOnAllWorktrayItems("Destroy");
                        cy.url().should('include', '/confirmAction');
                        cy.contains("Confirm").click();
                        cy.contains("Successfully destroyed the records.");
                        cy.url().should('include', '/confirmAction');
                        cy.contains("Confirm").click();
                        cy.contains("Successfully deleted empty containers.");
                        cy.contains("Confirm").should('be.disabled');
                        cy.contains("Done").click();
                    });
            });
    });

    it('should be able to destroy containers', function () {
        cy.createContainer("CYPRESS - destroyContainers1", "Edmonton", "Cypress - destroy", "Cypress-recordForDestruction", 500);
        cy.createContainer("CYPRESS - destroyContainers2", "Edmonton", "Cypress - destroy", "Cypress-recordForDestruction", 500);

        cy.actionOnAllWorktrayItems("Destroy");
        cy.url().should('include', '/confirmAction');
        cy.contains("Confirm").click();
        cy.contains("Successfully destroyed the records.");
        cy.url().should('include', '/confirmAction');
        cy.contains("Confirm").click();
        cy.contains("Successfully deleted empty containers.");
        cy.contains("Confirm").should('be.disabled');
        cy.contains("Done").click();
    });

    it('should be able to destroy closed records', function () {
        let recordNumbers = [];
        cy.createContainer("CYPRESS - destroyContainersClosedRecords", "Edmonton", "Cypress - destroy", "Cypress-recordForDestruction", 500);

        cy.get(":nth-child(1) > .rt-tr > > div > a")
            .then(firstRecordNumber => {
                recordNumbers.push(firstRecordNumber.text());

                cy.get(":nth-child(2) > .rt-tr > > div > a")
                    .then(secondRecordNumber => {
                        recordNumbers.push(secondRecordNumber.text());

                        cy.clearWorkTray();

                        recordNumbers.forEach(recordNumber => {
                            cy.goToRecord(recordNumber);
                            cy.contains("Remove From Container").click();
                            cy.get(".modal-footer > .btn-danger").click();
                        });

                        cy.addRecordsToWorkTray(recordNumbers);
                        cy.actionOnAllWorktrayItems("Destroy");
                        cy.url().should('include', '/confirmAction');
                        cy.contains("Confirm").click();
                        cy.contains("Successfully destroyed the records.");
                        cy.contains("Destroy Records");
                        cy.contains("Confirm").should('be.disabled');
                        cy.contains("Done").click();
                    });
            });
    });

    it('should not be authenticated to destroy container', function () {
        let containerNumbers = [];

        cy.createContainer("CYPRESS - destroyContainers1", "Edmonton", "Cypress - destroy", "Cypress-recordForDestruction", 500);

        cy.get("#containerNumberHeading")
            .then(containerNum => {
                containerNumbers.push(containerNum.text());

                cy.switchUser(101);
                cy.addContainersToWorkTray(containerNumbers);
                cy.actionOnAllWorktrayItems("Destroy");
                cy.contains("Confirm").click();
                cy.contains("You do not have permission to destroy record EDM-2018/708 from your location Edmonton.");
            })
    });
});

