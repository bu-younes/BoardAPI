package com.MohammedAlghafri.Board_API.Service;

import com.MohammedAlghafri.Board_API.Models.Board;
import com.MohammedAlghafri.Board_API.Models.Card;
import com.MohammedAlghafri.Board_API.Repository.BoardRepository;
import com.MohammedAlghafri.Board_API.Repository.CardRepository;
import com.MohammedAlghafri.Board_API.Request.CardRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CardService {

    @Autowired
    CardRepository cardRepository;

    @Autowired
    BoardService boardService;

    public Card createCard(Long boardId, Card card) {
        Board board = boardService.getBoardById(boardId);

        card.setBoard(board);

        return cardRepository.save(card);
    }

    public List<Card> getCardsFromBoard(Long boardId) {
        return cardRepository.findByBoardId(boardId);
    }

    public Card getCardFromBoard(Long boardId, Long cardId) {
        Card optionalCard = cardRepository.findByIdAndBoardId(cardId, boardId);
        return optionalCard;
    }


    public Card updateCard(Long boardId, Long cardId, CardRequest request) {
        Card card = cardRepository.findByIdAndBoardId(cardId, boardId);

        if (card == null) {
            return null;
        }

        // Update only if the corresponding values in the request are not empty or null
        if (request.getTitle() != null && !request.getTitle().isEmpty()) {
            card.setTitle(request.getTitle());
        }

        if (request.getDescription() != null && !request.getDescription().isEmpty()) {
            card.setDescription(request.getDescription());
        }

        if (request.getSection() != null) {
            card.setSectionId(request.getSection());
        }
        return cardRepository.save(card);
    }


    public boolean deleteCard(Long boardId, Long cardId) {
        Card cardToDelete = cardRepository.findByIdAndBoardId(cardId, boardId);

        if (cardToDelete == null) {
            return false; // Card not found
        }

        cardRepository.delete(cardToDelete);
        return true; // Card deleted successfully
    }
}