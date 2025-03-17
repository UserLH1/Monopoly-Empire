package com.example.monopolyEmpire.Model;
import com.example.monopolyEmpire.enumerations.UserRole;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table
public class User {
    @Id
    private String username;
    private UserRole rol;
    private String password;
    private int nrJocuriCastigate;
    private int idJoc;
    private int sumaBani;
    private int pozitiePion;
}
