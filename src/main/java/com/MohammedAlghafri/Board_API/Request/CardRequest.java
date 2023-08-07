package com.MohammedAlghafri.Board_API.Request;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CardRequest {
    private String title;
    private String description;
    private Integer section;
}
