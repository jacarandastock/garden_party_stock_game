// https://docs.cypress.io/api/introduction/api.html

describe('Dashboard Test Suite', () => {

  // Test Case 1: App Bar Visibility
  it('should display the app bar', () => {
    cy.visit('/');
    cy.get('[data-cy=app-bar]').should('be.visible');
  });

  // Test Case 2: Title Verification
  it('should display the title "Pharmacokinetic Equations"', () => {
    cy.visit('/');
    cy.get('[data-cy=app-bar]').contains('Pharmacokinetic Equations');
  });

  // Test Case 3: LocaleToggler Functionality
  it('should change the language when LocaleToggler is clicked', () => {
    cy.visit('/');
    cy.get('[data-cy=locale-toggler]').click();
      // Assuming you've added a data-cy attribute to the language list and options
    cy.get('[data-cy=language-list]').should('be.visible');
    cy.get('[data-cy=language-option-cn]').click();
    //TODO Check if all the texts are indeed change to chinese

  });
  // Test Case 4: ThemeToggler Functionality
  it('should change the theme when ThemeToggler is clicked', () => {
    cy.visit('/');
    cy.get('[data-cy=theme-toggler]').click();
    // Assuming that a class 'dark-theme' is added to the body when the theme is toggled
    cy.get('[data-cy=main-content]').should('have.class', 'dark:text-slate-300');

    // Toggle back to light mode
    cy.get('[data-cy=theme-toggle]').click();
    cy.get('[data-cy=main-content]').should('have.class', 'text-slate-700');
  });


  //TODO
  // // Test Case 5: LocaleToggler Boundary
  // it('should support the minimum and maximum number of languages', () => {
  //   cy.visit('/');
  //   cy.get('.locale-toggler').click();
  //   cy.get('.language-list').find('.language-option').should('have.length.gte', 1); // Minimum languages
  //   cy.get('.language-list').find('.language-option').should('have.length.lte', 10); // Maximum languages
  // });
  //
});
