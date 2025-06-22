Feature: Leaderboard

Scenario: Leaderboard returnează utilizatori în ordine descrescătoare după scor
  Given url baseUrl + '/api/leaderboard'
  When method get
  Then status 200
  And match response[0].score >= response[1].score
