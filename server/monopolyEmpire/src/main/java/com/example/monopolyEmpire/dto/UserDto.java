package com.example.monopolyEmpire.dto;

import com.example.monopolyEmpire.enumerations.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDto {
    private String username;
    private String password;
    private UserRole rol;
    private int nrJocuriCastigate;
    private int idJoc;
    private int sumaBani;
    private int pozitiePion;
}
