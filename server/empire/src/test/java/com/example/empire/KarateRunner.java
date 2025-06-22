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

    @Karate.Test
    Karate testPswd() {
        return Karate.run("classpath:karate/jucatori/pswd.feature").relativeTo(getClass());
    }

    @Karate.Test
    Karate testAccount() {
        return Karate.run("classpath:karate/jucatori/account.feature").relativeTo(getClass());
    }

    @Karate.Test
    Karate testUsers() {
        return Karate.run("classpath:karate/jucatori/users.feature").relativeTo(getClass());
    }

    @Karate.Test
    Karate testList() {
        return Karate.run("classpath:karate/jucatori/list.feature").relativeTo(getClass());
    }
}
