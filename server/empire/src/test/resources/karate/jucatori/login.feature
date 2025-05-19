Feature: Test pentru autentificare - API /api/jucatori/login

Scenario: Login cu date corecte
  Given url 'http://localhost:8080/api/jucatori/login'
  And request
    """
    {
      "username": "viva",
      "password": "123456"
    }
    """
  When method POST
  Then status 200
 And match response.data.token != null

