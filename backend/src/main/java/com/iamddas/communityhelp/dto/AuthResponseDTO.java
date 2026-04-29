package com.iamddas.communityhelp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private UserDTO user;
    private String message;

    public AuthResponseDTO(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
}
