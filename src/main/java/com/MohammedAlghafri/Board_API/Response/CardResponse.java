package com.MohammedAlghafri.Board_API.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CardResponse {
    private Long card_id;
    private String title;
    private String description;
    private Integer section;
}