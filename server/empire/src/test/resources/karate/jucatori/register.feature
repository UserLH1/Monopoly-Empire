Feature: Inregistrare utilizator

  Scenario: Inregistrare cu date valide
    Given url 'http://localhost:8080/api/jucatori/register'
    And request { "username": "karate.user1@e-uvt.ro", "password": "123456" }
    When method post
    Then status 200
    And match response.message == "Utilizatorul a fost creat cu succes"
