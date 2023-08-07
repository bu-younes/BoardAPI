package com.MohammedAlghafri.Board_API.Repository;

import com.MohammedAlghafri.Board_API.Models.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByBoardId(Long boardId);
   Card findByIdAndBoardId(Long cardId, Long boardId);

}