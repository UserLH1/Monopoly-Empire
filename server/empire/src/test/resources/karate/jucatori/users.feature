Feature: Listare utilizatori

Scenario: Obține toți utilizatorii
  Given url baseUrl + '/api/jucatori'
  When method get
  Then status 200
  And match response == '#[0]'  # lista nevidă
