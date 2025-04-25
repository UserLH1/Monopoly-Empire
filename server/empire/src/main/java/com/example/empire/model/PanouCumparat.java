package com.example.empire.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class PanouCumparat {
    @Id
    private int idPanouCumparat;
    @OneToOne
    @JoinColumn(name="fk_id_panou")
    private Panou panou;
    private int idTurn;
}
