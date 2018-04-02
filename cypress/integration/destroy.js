import {getIdFromLocation} from "../support/functions";

describe('destroy', function () {
    beforeEach(function () {
        cy.visit('/');
    });

    it('should be able to destroy on container details screen', function () {
        cy.createContainer("CYPRESS - destroy", "Edmonton", "Cypress - destroy", "Cypress-recordForDestruction", 500);

        cy.get(".btn-toolbar").contains("Destroy").click();
        cy.url().should('include', '/confirmAction');

        cy.contains("Destroy Records");
        cy.contains("Confirm").click();
        cy.contains("Successfully destroyed the records.");

        cy.contains("Delete Empty Containers");
        cy.contains("Confirm").click();
        cy.contains("Successfully deleted empty containers.");

        cy.contains("Confirm").should('be.disabled');
        cy.contains("Done").click();
    });

    it('should not be able to destroy unclosed record', function () {
        cy.createRecord("Subject", "Edmonton", null, "Cypress-Destroy unclosed record", ["CORPORATE AFFAIRS", "CONTRACTING"], "PUBLICATION - INVENTORY P5.I2.01", "CYPRESS-TEST", "CYPRESS TESTING", 500);

        cy.get(".btn-toolbar").contains("Destroy").click();
        cy.url().should('include', '/confirmAction');

        cy.contains("Destroy Records");
        cy.contains("Confirm").click();
        cy.contains("The record is not closed.");

        cy.contains("Confirm").should('be.disabled');
        cy.contains("Go Back").click();
    });

    it('should be able to destroy on record details screen', function () {
        let containerNumbers = [];
        let recordNumbers = [];
        let recordIds = [];
        let containerIds = [];
        cy.createContainer("CYPRESS - destroy record", "Edmonton", "Cypress - delete", "Cypress-recordForDeletion", 500);

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

                                    cy.goToRecord(recordNumbers[0]);

                                    cy.location().then(loc => {
                                        let locId = getIdFromLocation(loc);
                                        cy.log("Retrieved record id: " + locId);
                                        recordIds.push(locId);

                                        cy.goToRecord(recordNumbers[1]);

                                        cy.location().then(loc => {
                                            let locId = getIdFromLocation(loc);
                                            cy.log("Retrieved record id: " + locId);
                                            recordIds.push(locId);

                                            cy.log("Record ids: " + recordIds);
                                            cy.log("Container ids: " + containerIds);

                                            cy.viewRecordById(recordIds[0]);
                                            cy.get(".btn-toolbar").contains("Destroy").click();
                                            cy.url().should('include', '/confirmAction');
                                            cy.contains("Destroy Records");

                                            cy.contains("Confirm").click();
                                            cy.contains("Successfully destroyed the records.");

                                            cy.log("Container should not be empty and has one record left.");

                                            cy.contains("Confirm").should('be.disabled');
                                            cy.contains("Done").click();

                                            cy.log("Container should not be deleted.");
                                            cy.viewContainerById(containerIds[0]);
                                            cy.contains(containerNumbers[0]);

                                            cy.log("Container should be empty now.");
                                            cy.viewRecordById(recordIds[1]);
                                            cy.get(".btn-toolbar").contains("Destroy").click();
                                            cy.url().should('include', '/confirmAction');
                                            cy.contains("Destroy Records");

                                            cy.contains("Confirm").click();
                                            cy.contains("Successfully destroyed the records.");

                                            cy.contains("Delete Empty Containers");
                                            cy.contains("Confirm").click();
                                            cy.contains("Successfully deleted empty containers.");

                                            cy.contains("Confirm").should('be.disabled');
                                            cy.contains("Done").click();

                                            recordIds.forEach(recordId => {
                                                cy.viewRecordById(recordId);
                                                cy.get("#recordState").contains("Destroyed");
                                            });

                                            cy.viewContainerById(containerIds[0]);
                                            cy.url().should('include', '/notFound');
                                            cy.contains("Not Found");
                                        });
                                    });
                                });
                        });
                });
            });
    });


    it('should be able to destroy containers and closed records and delete containers', function () {
        let recordId = 0;
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

                cy.location().then(loc => {
                    recordId = getIdFromLocation(loc);
                    cy.get("#recordState").contains("Archived - Local");

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

                            cy.viewRecordById(recordId);
                            cy.get("#recordState").contains("Destroyed");
                        });
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
                cy.contains("You do not have permission to destroy record");
            })
    });
});

