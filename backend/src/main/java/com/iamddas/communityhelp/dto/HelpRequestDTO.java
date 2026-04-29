package com.iamddas.communityhelp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HelpRequestDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String status;
    private String location;
    private UserDTO createdBy;
    private UserDTO acceptedBy;
    private String createdAt;
    private String updatedAt;
}
