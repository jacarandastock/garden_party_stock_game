describe('Navigation Tests', () => {

    beforeEach(() => {
        cy.visit('http://localhost:5174/#/formulas/intravenousInfusionAndEffectOfClearance')
    });

    it('tests the navigation buttom and bar', () => {
        // Verify side navigation bar is not visible
        cy.get('[data-cy=side-nav]').should('not.be.visible');

        // Click to expand the side navigation bar
        cy.get('[data-cy=nav-bar-btn]').click();

        // Verify side navigation bar is visible
        cy.get('[data-cy=side-nav]').should('be.visible');

        // Click on the first item in the navigation bar (this can be expanded for all items)
        cy.get('[data-cy=nav-formula]').first().click();


    });
});
