package com.example.empire;

import com.intuit.karate.junit5.Karate;

class KarateRunner {

    @Karate.Test
    Karate testLogin() {
        return Karate.run("classpath:karate/jucatori/login.feature").relativeTo(getClass());
    }
     @Karate.Test
    Karate testRegister() {
        return Karate.run("classpath:karate/jucatori/register.feature").relativeTo(getClass());
    }
}
