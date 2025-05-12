package com.example.empire.service.serviceImpl;

import com.example.empire.dto.DetaliiPozitieDto;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.Panou;
import com.example.empire.repository.PanouRepository;
import com.example.empire.service.PanouService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PanouServiceImpl implements PanouService {
    private final PanouRepository panouRepository;

    public PanouServiceImpl(PanouRepository panouRepository) {
        this.panouRepository = panouRepository;
    }

    @Override
    public ArrayList<Panou> getAllPanels() {
        List<Panou> panouri = panouRepository.findAll();
        return (ArrayList<Panou>) panouri;
    }

    @Override
    public Panou getPanelById(int idPanou) {
        Optional<Panou> optional= panouRepository.getPanouByIdPanou(idPanou);
        if(optional.isPresent())
            return optional.get();
        throw new BadRequestException("Nu exista un panou cu acest Id");
    }

    @Override
    public ArrayList<DetaliiPozitieDto> getAllPositionsInGame() {
        ArrayList<DetaliiPozitieDto> pozitii = new ArrayList<>();
        List<Panou> panouri = panouRepository.findAll();
        for(Panou panou: panouri){
            DetaliiPozitieDto detaliiPozitieDto = new DetaliiPozitieDto();
            detaliiPozitieDto.setId(panou.getIdPanou());
            detaliiPozitieDto.setPosition(panou.getPozitieTablaJoc());
            detaliiPozitieDto.setValue(panou.getPret());
            detaliiPozitieDto.setValueForTower(panou.getValoareAdaugataTurn());
            detaliiPozitieDto.setName(panou.getNume());
            detaliiPozitieDto.setType("brand");
            detaliiPozitieDto.setColor(panou.getCuloare());
            detaliiPozitieDto.setLogo(panou.getLogo());
            pozitii.add(detaliiPozitieDto);
        }

        DetaliiPozitieDto start = new DetaliiPozitieDto();
        start.setColor("#fffffff");
        start.setPosition(0);
        start.setId(-1);
        start.setName("Start");
        start.setType("corner");
        start.setValueForTower(0);
        start.setValue(0);

        DetaliiPozitieDto impozit = new DetaliiPozitieDto();
        start.setColor("#fffffff");
        start.setPosition(2);
        start.setId(-1);
        start.setName("Impozit");
        start.setType("Impozit");
        start.setValueForTower(0);
        start.setValue(0);


        DetaliiPozitieDto cardEmpire = new DetaliiPozitieDto();
        cardEmpire.setName("Empire Card");
        cardEmpire.setId(-1);
        cardEmpire.setType("empire");
        cardEmpire.setValueForTower(0);
        cardEmpire.setPosition(4);

        DetaliiPozitieDto inchisoare = new DetaliiPozitieDto();
        inchisoare.setId(-1);
        inchisoare.setPosition(8);
        inchisoare.setName("Just Visiting / Jail");
        inchisoare.setType("corner");

        DetaliiPozitieDto cardSansa = new DetaliiPozitieDto();
        cardSansa.setType("chance");
        cardSansa.setName("Chance");
        cardSansa.setPosition(12);
        cardSansa.setId(-1);

        DetaliiPozitieDto freeParking = new DetaliiPozitieDto();
        freeParking.setName("Free Parking");
        freeParking.setPosition(15);
        freeParking.setType("utility");

        DetaliiPozitieDto cardEmpire2 = new DetaliiPozitieDto();
        cardEmpire2.setName("Empire Card");
        cardEmpire2.setId(-1);
        cardEmpire2.setType("empire");
        cardEmpire2.setValueForTower(0);
        cardEmpire2.setPosition(20);

        DetaliiPozitieDto toJail = new DetaliiPozitieDto();
        toJail.setType("corner");
        toJail.setPosition(24);
        toJail.setName("Go to Jail");

        DetaliiPozitieDto cardSansa2 = new DetaliiPozitieDto();
        cardSansa.setType("chance");
        cardSansa.setName("Chance");
        cardSansa.setPosition(27);
        cardSansa.setId(-1);

        DetaliiPozitieDto cardEmpire3 = new DetaliiPozitieDto();
        cardEmpire3.setName("Empire Card");
        cardEmpire3.setId(-1);
        cardEmpire3.setType("empire");
        cardEmpire3.setValueForTower(0);
        cardEmpire3.setPosition(29);

        pozitii.add(cardEmpire2);
        pozitii.add(cardEmpire);
        pozitii.add(cardEmpire3);
        pozitii.add(cardSansa);
        pozitii.add(cardSansa2);
        pozitii.add(impozit);
        pozitii.add(inchisoare);
        pozitii.add(start);
        pozitii.add(toJail);
        pozitii.add(freeParking);
        return pozitii;
    }
}
