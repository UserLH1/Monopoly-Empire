Feature: Login eșuat

Scenario: Utilizatorul introduce o parolă greșită
  Given url baseUrl + '/login'
  And request { username: 'horatiu', password: 'abcd1234' }
  When method post
  Then status 401
  And match response.message contains 'Invalid'
