describe('/admin', () => {
  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.keycloackLogin(oauth2Data, 'user');
    });
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.keycloackLogout(oauth2Data);
    });
    cy.clearCache();
  });

  describe('Details widget', () => {
    it('should load the page', () => {
      // We should check with data-cy instead
      cy.get('.MuiBox-root').should('be.visible');
    });
  });
});
