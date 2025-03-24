package com.example.empire.service.serviceImpl;

import com.example.empire.dto.LoginDto;
import com.example.empire.dto.UpdateMoneyDto;
import com.example.empire.dto.UserDto;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.Utilizator;
import com.example.empire.repository.UtilizatorRepository;
import com.example.empire.service.UtilizatorService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UtilizatorServiceImpl implements UtilizatorService {
    private final UtilizatorRepository jucatorRepository;

    public UtilizatorServiceImpl(UtilizatorRepository jucatorRepository) {
        this.jucatorRepository = jucatorRepository;
    }

    @Override
    public Utilizator createUser(UserDto userDto){
        Utilizator user = new Utilizator();
        user.setRol(null);
        user.setUsername(userDto.getUsername());
        user.setIdJoc((long) -1);
        user.setPozitiePion(-1);
        user.setNrJocuriCastigate(0);
        user.setSumaBani(0);
        user.setPassword(userDto.getPassword());
        return jucatorRepository.save(user);

    }

    @Override
    public Utilizator loginUser(LoginDto userDto) {
        Optional<Utilizator> optionalUser = jucatorRepository.getAllByUsername(userDto.getUsername());
        if(optionalUser.isPresent()){
            Utilizator utilizator = optionalUser.get();
            if(utilizator.getPassword().equals(userDto.getPassword()))
                return utilizator;
            else
                throw new BadRequestException("Parola gresita");
        }
        else{
            throw new BadRequestException("Nu exista acest username");
        }
    }

    @Override
    public ArrayList<UserDto> extrageJucatoriiUnuiJoc(Long idJoc) {
        ArrayList<Utilizator> utilizators = jucatorRepository.getAllByIdJoc(idJoc);
        ArrayList<UserDto> userDtos = new ArrayList<>();
        for(Utilizator user: utilizators){
            UserDto userDto = new UserDto();
            userDto.setIdJoc(user.getIdJoc());
            userDto.setRol(String.valueOf(user.getRol()));
            userDto.setNrJocuriCastigate(user.getNrJocuriCastigate());
            userDto.setPozitiePion(user.getPozitiePion());
            userDto.setSumaBani(userDto.getSumaBani());
            userDtos.add(userDto);
        }
        return userDtos;
    }

    @Override
    public ArrayList<UserDto> extrageTotiJucatorii() {
        List<Utilizator> utilizators = jucatorRepository.findAll();
        ArrayList<UserDto> userDtos = new ArrayList<>();
        for(Utilizator user: utilizators){
            UserDto userDto = new UserDto();
            userDto.setIdJoc(user.getIdJoc());
            userDto.setRol(String.valueOf(user.getRol()));
            userDto.setNrJocuriCastigate(user.getNrJocuriCastigate());
            userDto.setPozitiePion(user.getPozitiePion());
            userDto.setSumaBani(userDto.getSumaBani());
            userDtos.add(userDto);
        }
        return userDtos;
    }

    @Override
    public int getUserPosition(String username) {
        Optional<Utilizator> optionalUser = jucatorRepository.getAllByUsername(username);
        if(optionalUser.isPresent()){
            Utilizator utilizator = optionalUser.get();
            if(utilizator.getIdJoc()!=-1)
                return utilizator.getPozitiePion();
            else
                throw new BadRequestException("Acest user nu este activ intr-un joc");
        }
        else{
            throw new BadRequestException("Nu exista acest username");
        }
    }

    @Override
    public int getUserMoney(String username) {
        Optional<Utilizator> optionalUser = jucatorRepository.getAllByUsername(username);
        if(optionalUser.isPresent()){
            Utilizator utilizator = optionalUser.get();
            if(utilizator.getIdJoc()!=-1)
                return utilizator.getSumaBani();
            else
                throw new BadRequestException("Acest user nu este activ intr-un joc");
        }
        else{
            throw new BadRequestException("Nu exista acest username");
        }
    }

    @Override
    public void updateMoney(UpdateMoneyDto updateMoneyDto) {
        Optional<Utilizator> optionalUser = jucatorRepository.getAllByUsername(updateMoneyDto.getUsername());
        if(optionalUser.isPresent()){
            Utilizator utilizator = optionalUser.get();
            utilizator.setSumaBani(updateMoneyDto.getMoney());
            jucatorRepository.save(utilizator);
        }
        else{
            throw new BadRequestException("Nu exista acest username");
        }
    }

    @Override
    public void updatePosition(UpdateMoneyDto updateMoneyDto) {
        Optional<Utilizator> optionalUser = jucatorRepository.getAllByUsername(updateMoneyDto.getUsername());
        if(optionalUser.isPresent()){
            Utilizator utilizator = optionalUser.get();
            utilizator.setPozitiePion(updateMoneyDto.getMoney());
            jucatorRepository.save(utilizator);
        }
        else{
            throw new BadRequestException("Nu exista acest username");
        }
    }

    @Override
    public Long getUserGame(String username) {
        Optional<Utilizator> optionalUser = jucatorRepository.getAllByUsername(username);
        if(optionalUser.isPresent()){
            return  optionalUser.get().getIdJoc();
        }
        else{
            throw new BadRequestException("Nu exista acest username");
        }
    }

}
