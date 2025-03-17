package com.example.monopolyEmpire.Controller;

import com.example.monopolyEmpire.dto.UserDto;
import com.example.monopolyEmpire.service.JucatorService;
import com.example.monopolyEmpire.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "")
@CrossOrigin
public class JucatorController {

    private final JucatorService jucatorService;

    @Autowired
    public JucatorController(JucatorService jucatorService) {
        this.jucatorService = jucatorService;
    }

    @PostMapping("/jucator")
    public ResponseEntity<ApiResponse> createUser(@RequestBody UserDto userDto){
        jucatorService.createUser(userDto);
        return ResponseEntity.ok(ApiResponse.success("User saved successfully", null));
    }
}
