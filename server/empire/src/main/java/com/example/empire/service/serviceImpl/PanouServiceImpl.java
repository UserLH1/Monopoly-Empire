package com.example.empire.service.serviceImpl;

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
}
