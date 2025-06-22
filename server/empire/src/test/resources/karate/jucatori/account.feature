Feature: Register eșuat

Scenario: Încercare de înregistrare cu username deja folosit
  Given url baseUrl + '/register'
  And request { username: 'viva', password: '123456' }
  When method post
  Then status 409
  And match response.message contains 'exista'
