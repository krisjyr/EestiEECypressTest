describe("eesti.ee veebilehe automaattestid", () => {
  beforeEach(() => {
    cy.visit("https://www.eesti.ee");
    cy.viewport(1366, 768);
  });

  describe("Avalehe toimivuse kontroll", () => {
    it("Lehekülg peaks laadima korrektselt", () => {
      cy.url().should("include", "eesti.ee");
      cy.title().should("not.be.empty");
    });

    it("Otsinguriba peab olema nähtav ja funktsioneerima", () => {
      cy.get("search-bar")
        .should("be.visible")
        .find("input[type=text]")
        .should("have.attr", "placeholder")
        .and("match", /otsi/i);
    });

    it("Peamised menüüpunktid peaksid olema olemas ja töötama", () => {
      const menuItems = ["Aktuaalsed teemad", "Eesti Vabariik", "Õigusabi"];

      menuItems.forEach((item) => {
        cy.contains("button", item)
          .should("be.visible")
          .click();
      });
    });
  });

  describe("Otsingufunktsiooni testimine", () => {
    it('Otsingu "Eesti hümn" tulemused peavad olema asjakohased', () => {
      cy.get("search-bar input[type=text]").type("Eesti hümn{enter}");
      cy.url().should("include", "search=");
      cy.contains("h2", "Artiklid").should("be.visible");
      cy.contains("h3 mark", "Eesti hümn").should("be.visible");
    });

    it("Tühja otsingu korral peaks kuvama veateate", () => {
      cy.visit("https://www.eesti.ee/eraisik/et/otsing?search=%20");
      cy.contains("0 tulemust").should("be.visible");
    });
  });

  describe("Teenuste lehele liikumise kontroll", () => {
    it('"Tervis ja retseptid" alajaotised peavad olema nähtavad', () => {
      cy.contains("button", "Tervis ja retseptid").should("be.visible").click();
      cy.contains("p", "Retseptid").should("be.visible");
    });

    it('"Retseptid" leht peab laadima korrektselt', () => {
      cy.contains("button", "Tervis ja retseptid").click();
      cy.contains("p", "Retseptid").click();
    });
  });

  describe("Kontaktinfo lehe testimine", () => {
    beforeEach(() => {
      cy.contains("a", "Võtke meiega ühendust").click({ force: true });
    });

    it("Kontaktivormi väljad peavad olema olemas ja korrektselt töötama", () => {
      cy.get("form").should("exist");
      cy.get('input[required]').should("have.length.at.least", 2);
    });

    it("Vale e-posti aadressi sisestamisel peab ilmuma veateade", () => {
      cy.get('input[type="text"][required][name="ria-contact-form-email"]').first().type("a");
      cy.get("textarea").type("Testküsimus");
      cy.contains("button", "Saada kiri").click();
      cy.contains("p", "Sisestage kehtiv e-posti aadress.").should("be.visible");
    });
  });
});