package com.example.empire.service.serviceImpl;

import com.example.empire.dto.LoginDto;
import com.example.empire.dto.UpdateMoneyDto;
import com.example.empire.dto.UpdatePozitiePionDto;
import com.example.empire.dto.UserDto;
import com.example.empire.enums.UserRole;
import com.example.empire.exceptions.BadRequestException;
import com.example.empire.model.Utilizator;
import com.example.empire.repository.UtilizatorRepository;
import com.example.empire.service.UtilizatorService;
import com.example.empire.utils.AuthenticationResponse;
import com.example.empire.config.JwtService;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UtilizatorServiceImpl implements UtilizatorService {
    private final UtilizatorRepository jucatorRepository;
    private final JwtService jwtService;

    public UtilizatorServiceImpl(UtilizatorRepository jucatorRepository, JwtService jwtService) {
        this.jucatorRepository = jucatorRepository;
        this.jwtService = jwtService;
    }

    @Override
    public AuthenticationResponse createUser(LoginDto userDto){
        Optional<Utilizator> optional = jucatorRepository.getUtilizatorByUsername(userDto.getUsername());
        if(optional.isPresent())
            throw new BadRequestException("Acest username apartine deja altui jucator");
        Utilizator user = new Utilizator();
        user.setRol(UserRole.valueOf("PLAYER"));
        user.setUsername(userDto.getUsername());
        user.setIdJoc((long) -1);
        user.setPozitiePion(-1);
        user.setNrJocuriCastigate(0);
        user.setSumaBani(0);
        user.setRol(UserRole.PLAYER);
        String password = BCrypt.hashpw(userDto.getPassword(), BCrypt.gensalt());
        user.setPassword(password);
        jucatorRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    @Override
    public Utilizator loginUser(LoginDto userDto) {
        Optional<Utilizator> optionalUser = jucatorRepository.getUtilizatorByUsername(userDto.getUsername());
        if(optionalUser.isPresent()){
            Utilizator utilizator = optionalUser.get();
            boolean isMatch = BCrypt.checkpw(userDto.getPassword(), utilizator.getPassword());
            if (!isMatch) {
                throw new BadRequestException("Wrong password");
            }
            return utilizator;
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
            userDto.setNumarJocuriCastigate(user.getNrJocuriCastigate());
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
            userDto.setUsername(user.getUsername());
            userDto.setIdJoc(user.getIdJoc());
            userDto.setRol(String.valueOf(user.getRol()));
            userDto.setNumarJocuriCastigate(user.getNrJocuriCastigate());
            userDto.setPozitiePion(user.getPozitiePion());
            userDto.setSumaBani(userDto.getSumaBani());
            userDtos.add(userDto);
        }
        return userDtos;
    }

    @Override
    public int getUserPosition(String username) {
        Optional<Utilizator> optionalUser = jucatorRepository.getUtilizatorByUsername(username);
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
        Optional<Utilizator> optionalUser = jucatorRepository.getUtilizatorByUsername(username);
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
        Optional<Utilizator> optionalUser = jucatorRepository.getUtilizatorByUsername(updateMoneyDto.getUsername());
        if(optionalUser.isPresent()){
            Utilizator utilizator = optionalUser.get();
            utilizator.setSumaBani(updateMoneyDto.getSumaBani());
            jucatorRepository.save(utilizator);
        }
        else{
            throw new BadRequestException("Nu exista acest username");
        }
    }

    @Override
    public void updatePosition(UpdatePozitiePionDto updateMoneyDto) {
        Optional<Utilizator> optionalUser = jucatorRepository.getUtilizatorByUsername(updateMoneyDto.getUsername());
        if(optionalUser.isPresent()){
            Utilizator utilizator = optionalUser.get();
            utilizator.setPozitiePion(updateMoneyDto.getPozitiePion());
            jucatorRepository.save(utilizator);
        }
        else{
            throw new BadRequestException("Nu exista acest username");
        }
    }

    @Override
    public Long getUserGame(String username) {
        Optional<Utilizator> optionalUser = jucatorRepository.getUtilizatorByUsername(username);
        if(optionalUser.isPresent()){
            return  optionalUser.get().getIdJoc();
        }
        else{
            throw new BadRequestException("Nu exista acest username");
        }
    }

    @Override
    public UserDto getUser(String username) {
        Optional<Utilizator> optionalUser = jucatorRepository.getUtilizatorByUsername(username);
        if(optionalUser.isPresent()){
            UserDto userDto = new UserDto();
            userDto.setSumaBani(optionalUser.get().getSumaBani());
            userDto.setRol(String.valueOf(optionalUser.get().getRol()));
            userDto.setUsername(username);
            userDto.setIdJoc(optionalUser.get().getIdJoc());
            userDto.setNumarJocuriCastigate(optionalUser.get().getNrJocuriCastigate());
            return  userDto;
        }
        else{
            throw new BadRequestException("Nu exista acest username");
        }    }

    @Override
    public void stergeUser(String username) {
        Optional<Utilizator> optionalUser = jucatorRepository.getUtilizatorByUsername(username);
        if(optionalUser.isPresent()){
            jucatorRepository.delete(optionalUser.get());
        }
        else{
            throw new BadRequestException("Nu exista acest username");
        }
    }

}
