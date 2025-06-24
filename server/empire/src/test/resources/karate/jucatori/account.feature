Feature: Register eșuat

Scenario: Încercare de înregistrare cu username deja folosit
  Given url baseUrl + '/register'
  And request { username: 'horatiu', password: 'abcd1234' }
  When method post
  Then status 409
  And match response.message contains 'exista'
