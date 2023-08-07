package com.MohammedAlghafri.Board_API.Controller;

import com.MohammedAlghafri.Board_API.Models.Card;

import com.MohammedAlghafri.Board_API.Request.CardRequest;

import com.MohammedAlghafri.Board_API.Response.CardResponse;
import com.MohammedAlghafri.Board_API.Service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/boards/{boardId}/cards")
@CrossOrigin("*")

public class CardController {

    @Autowired
    CardService cardService;


    @PostMapping
    public ResponseEntity<CardResponse> createCard(
            @PathVariable Long boardId,
            @RequestBody CardRequest request
    ) {
        Card card = new Card();

        card.setTitle(request.getTitle());
        card.setDescription(request.getDescription());
        card.setSectionId(request.getSection());

        cardService.createCard(boardId, card);

        CardResponse response = mapCardToResponse(card);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{cardId}")
    public ResponseEntity<CardResponse> updateCard(
            @PathVariable Long boardId,
            @PathVariable Long cardId,
            @RequestBody CardRequest request
    ) {
        Card updatedCard = cardService.updateCard(boardId, cardId, request);

        if (updatedCard == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        CardResponse response = mapCardToResponse(updatedCard);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @DeleteMapping("/{cardId}")
   public ResponseEntity<?> deleteCard(
            @PathVariable Long boardId,
            @PathVariable Long cardId
   ) {
       boolean isDeleted = cardService.deleteCard(boardId, cardId);

       if (isDeleted) {            String message = "Card with ID " + cardId + " has been deleted successfully from board " + boardId + ".";
           return ResponseEntity.ok().body(Map.of("message", message));
        } else {
            return ResponseEntity.notFound().build();
       }
    }

    @GetMapping
    public ResponseEntity<Map<String, List<CardResponse>>> getCardsFromBoard(@PathVariable("boardId") Long boardId) {
        List<Card> cards = cardService.getCardsFromBoard(boardId);

        List<CardResponse> cardResponses = cards.stream()
                .map(this::mapCardToResponse)
                .collect(Collectors.toList());

        Map<String, List<CardResponse>> responseBody = new HashMap<>();
        responseBody.put("cards", cardResponses);

        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @GetMapping("/{cardId}")
    public ResponseEntity<CardResponse> getCardFromBoard(
            @PathVariable Long boardId,
            @PathVariable Long cardId
    ) {
        Card card = cardService.getCardFromBoard(boardId, cardId);

        if (card == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        CardResponse response = mapCardToResponse(card);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private CardResponse mapCardToResponse(Card card) {
        CardResponse response = new CardResponse();
        response.setCard_id(card.getId());
        response.setTitle(card.getTitle());
        response.setDescription(card.getDescription());
        response.setSection(card.getSectionId());
        return response;
    }
}