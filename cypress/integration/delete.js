import {getIdFromLocation} from "../support/functions";

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

    it('should delete non-empty container and records', function () {
        let containerNumbers = [];
        let recordNumbers = [];
        let recordIds = [];
        let containerIds = [];
        cy.createContainer("CYPRESS - deleteContainer", "Edmonton", "Cypress - delete", "Cypress-recordForDeletion", 500);

        cy.get("#containerNumberHeading")
            .then(containerNum => {
                cy.location().then(loc => {
                    containerIds.push(getIdFromLocation(loc));
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

                                    cy.location().then(loc => {
                                        recordIds.push(getIdFromLocation(loc));
                                        cy.contains("Delete").click();
                                        cy.get(".modal-footer > .btn-danger").click();
                                        cy.contains("This record has been successfully deleted.");

                                        cy.goToRecord(recordNumbers[1]);

                                        cy.location().then(loc => {
                                            recordIds.push(getIdFromLocation(loc));

                                            cy.addContainersToWorkTray([containerNum.text()]);

                                            cy.actionOnAllWorktrayItems("Delete");
                                            cy.url().should('include', '/confirmAction');
                                            cy.contains("Confirm").click();
                                            cy.contains("Successfully deleted the records and containers.");

                                            cy.visit('/worktray');
                                            cy.contains("No rows found");

                                            recordIds.forEach(id => {
                                                cy.viewRecordById(id);
                                                cy.contains("Not Found");
                                                cy.url().should('include', '/notFound');
                                            });

                                            containerIds.forEach(id => {
                                                cy.viewContainerById(id);
                                                cy.contains("Not Found");
                                                cy.url().should('include', '/notFound');
                                            })
                                        });
                                    });
                                });
                        });
                });
            });
    });

    it('should not be able to delete a items outside of authorized locations', function () {
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

                                cy.switchUser(101);

                                recordNumbers.forEach(recordNum => {
                                    cy.goToRecord(recordNum);
                                    cy.contains("Remove From Container").click();
                                    cy.get(".modal-footer > .btn-danger").click();

                                    cy.contains("Delete").click();
                                    cy.get(".modal-footer > .btn-danger").click();
                                    cy.contains("You do not have permission to delete records in Edmonton.");
                                });

                                cy.goToContainer(containerNumbers[0]);
                                cy.contains("Delete").click();
                                cy.get(".modal-footer > .btn-danger").click();
                                cy.contains("You do not have permission to delete container " + containerNumbers[0] + " from your location.");

                                cy.addContainersToWorkTray(containerNumbers);
                                cy.actionOnAllWorktrayItems("Delete");
                                cy.contains("Confirm").click();
                                cy.contains("You do not have permission to delete container " + containerNumbers[0] + " from your location.");
                            });
                    });
            });
    });
})
;
