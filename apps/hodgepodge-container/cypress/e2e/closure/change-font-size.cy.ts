const pagePath = 'src/closure/change-font-size/index.html';

describe('Closure', () => {
  it('Visit change-font-size/index.html', () => {
    cy.visit(pagePath);
  });

  it('should be able to click on button with 12 as its label', () => {
    cy.visit(pagePath);
    cy.contains('12').click();
    cy.get('body').should('have.css', 'font-size', '12px');
  });

  it('should be able to click on button with 14 as its label', () => {
    cy.visit(pagePath);
    cy.contains('14').click();
    cy.get('body').should('have.css', 'font-size', '14px');
  });

  it('should be able to click on button with 16 as its label', () => {
    cy.visit(pagePath);
    cy.contains('16').click();
    cy.get('body').should('have.css', 'font-size', '16px');
  });
});
