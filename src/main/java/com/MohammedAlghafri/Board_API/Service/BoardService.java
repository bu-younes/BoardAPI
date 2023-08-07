package com.MohammedAlghafri.Board_API.Service;




import com.MohammedAlghafri.Board_API.Models.Board;
import com.MohammedAlghafri.Board_API.Repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;


@Service
public class BoardService {

    private final BoardRepository boardRepository;

    @Autowired
    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    public Board getBoardById(Long boardId) {
        Optional<Board> optionalBoard = boardRepository.findById(boardId);
        return optionalBoard.orElse(null);
    }
    public Board createBoard(String title) {
        Board board = new Board();
        board.setTitle(title);

        return boardRepository.save(board);
    }

    public Board updateBoardName(Long boardId, String newName) {
        Optional<Board> optionalBoard = boardRepository.findById(boardId);
        if (optionalBoard.isPresent()) {
            Board board = optionalBoard.get();
            board.setTitle(newName);
            return boardRepository.save(board);
        }
        return null;
    }


    public boolean deleteBoardById(Long boardId) {
        if (boardRepository.existsById(boardId)) {
            boardRepository.deleteById(boardId);
            return true;
        }
        return false;
    }
}