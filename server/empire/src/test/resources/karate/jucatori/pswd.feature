Feature: Login eșuat

Scenario: Utilizatorul introduce o parolă greșită
  Given url baseUrl + '/login'
  And request { username: 'adriana', password: 'gresita' }
  When method post
  Then status 401
  And match response.message contains 'Invalid'
