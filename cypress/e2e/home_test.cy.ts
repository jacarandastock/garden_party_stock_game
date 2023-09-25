describe('Home Page Test Suite', () => {

    beforeEach(() => {
        cy.viewport(1280, 800);
        cy.visit('/'); // Visit the home page before each test
    });

    // Test Case 1: Check if the home page displays the formula cards
    it('should display the formula cards', () => {
        cy.get('[data-cy=formula-card-0]').should('be.visible');
        cy.get('[data-cy=formula-card-1]').should('be.visible');
        cy.get('[data-cy=formula-card-2]').should('be.visible');
        cy.get('[data-cy=formula-card-3]').should('be.visible');
        cy.get('[data-cy=formula-card-4]').should('be.visible');
    });

    // Test Case 2: Check formula card title
    it('should display the correct title on the formula card', () => {
        cy.get('[data-cy=formula-card-title-0]').first().should('contain.text', 'Single IV Dosing'); // Replace 'Expected Title' with the actual title
        cy.get('[data-cy=formula-card-title-1]').first().should('contain.text', 'Oral Dosing Plasma-time Curve'); // Replace 'Expected Title' with the actual title
        cy.get('[data-cy=formula-card-title-2]').first().should('contain.text', 'Intravenous Infusion and Effect of Clearance'); // Replace 'Expected Title' with the actual title
        cy.get('[data-cy=formula-card-title-3]').first().should('contain.text', 'Non-linear Pharmacokinetics - Initial Zero Order followed by First Order Elimination'); // Replace 'Expected Title' with the actual title
        cy.get('[data-cy=formula-card-title-4]').first().should('contain.text', 'Multiple Oral Dosing'); // Replace 'Expected Title' with the actual title
    });

    // Test Case 3: Check formula card image
    it('should display the correct image on the formula card', () => {
        cy.get('[data-cy=formula-card-image-0] img.v-img__img').first().should('have.attr', 'src', '/src/assets/singleIVDosingImage.png'); // Replace 'Expected Image URL' with the actual image URL
        cy.get('[data-cy=formula-card-image-1] img.v-img__img').first().should('have.attr', 'src', '/src/assets/oralDosingPlasmaTimeCurveImage.png'); // Replace 'Expected Image URL' with the actual image URL
        cy.get('[data-cy=formula-card-image-2] img.v-img__img').first().should('have.attr', 'src', '/src/assets/intravenousInfusionAndEffectOfClearanceImage.png'); // Replace 'Expected Image URL' with the actual image URL
        cy.get('[data-cy=formula-card-image-3] img.v-img__img').first().should('have.attr', 'src', '/src/assets/nonLinearPharmacokineticsImage.png'); // Replace 'Expected Image URL' with the actual image URL
        cy.get('[data-cy=formula-card-image-4] img.v-img__img').first().should('have.attr', 'src', '/src/assets/multipleOralDosingImage.png'); // Replace 'Expected Image URL' with the actual image URL
    });

    // Test Case 4: Check navigation on formula card click
    it('should navigate to the correct route when a formula card is clicked', () => {
        cy.get('[data-cy=formula-card-0]').first().click();
        // Assuming the first card's path is '/single-iv-dosing'
        cy.url().should('include', '/single-iv-dosing');
    });

});
