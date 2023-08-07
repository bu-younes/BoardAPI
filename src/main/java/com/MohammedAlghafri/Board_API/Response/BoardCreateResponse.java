package com.MohammedAlghafri.Board_API.Response;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BoardCreateResponse {
    private Long board_id;
    private String name;
    private Map<Integer, String> columns;
}