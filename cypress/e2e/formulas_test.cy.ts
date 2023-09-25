describe('Formula Layout Test Suite', () => {


    beforeEach(() => {
        cy.visit('http://localhost:5174/#/formulas/intravenousInfusionAndEffectOfClearance')
    });

    it('should display the navigation bar button', () => {
        cy.get('[data-cy=nav-bar-btn]').should('be.visible');
    });

    // Test Case 2: Title Verification
    it('should display the title "Useful Pharmacokinetic Equations"', () => {
        cy.contains('Useful Pharmacokinetic Equations').should('be.visible');
    });

    // Test Case 3: Toggle Side Navigation Bar
    it('should display the side navigation bar when the button is clicked', () => {
        cy.get('[data-cy=nav-bar-btn]').click();
        cy.get('[data-cy=side-nav]').should('be.visible');
    });

    // Test Case 4: Navigate to a Formula
    it('should navigate to a formula when clicked in the side navigation', () => {
        cy.get('[data-cy=nav-bar-btn]').click();
        cy.get('[data-cy=nav-formula]').first().click();
        //check the url if the page navigation is successful
        cy.url().should('eq', 'http://localhost:5174/#/formulas/single-iv-dosing');

    });
});
