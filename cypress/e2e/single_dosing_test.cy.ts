describe('Formula Page Test Suite', () => {

    beforeEach(() => {
        cy.visit('http://localhost:5174/#/formulas/single-iv-dosing')
    });

    // Test Case 1: Formula Title Card
    it('should display the formula title card', () => {
        cy.get('[data-cy=formula-title-card]').should('be.visible');
        cy.get('[data-cy=formula-title-card]').should('contain.text','Single IV Dosing');
    });

    // Test Case 2: Expansion Panel Functionality
    it('Panel is set to open at default,can be closed by click', () => {
        // The content should be visible without any interaction
        cy.get('[data-cy=description-panel-content]').should('be.visible');
        cy.get('[data-cy=description-panel-content]').should('contain.text',"The simplest model is of first order elimination following a single IV dose since we only have to consider the elimination process and we start with all the drug in the blood. There are many assumptions in all PK models and it is good to keep that in mind. You may ask “How is it possible that a given drug is guaranteed to behave in this way?” and you’d be right! There are many variables to consider. Gut metabolism, proportion of the molecule in salt form, hepatic extraction ratio. But for now, start with the single IV dose and you will begin to understand the most critical relationships between PK parameters used in drug design and clinical descision making.");
        cy.get('[data-cy=description-expansion-panel]').click();
        cy.get('[data-cy=description-panel-content]').should('not.be.visible');

    });

    // // TODO: Add more test cases as needed, such as checking the content of the graph,
    // // interactions with the graph, code editor functionality, etc.

});
