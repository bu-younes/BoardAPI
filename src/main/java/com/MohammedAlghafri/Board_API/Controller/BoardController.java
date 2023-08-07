package com.MohammedAlghafri.Board_API.Controller;



import com.MohammedAlghafri.Board_API.Models.Board;
import com.MohammedAlghafri.Board_API.Request.BoardCreateRequest;
import com.MohammedAlghafri.Board_API.Response.BoardCreateResponse;
import com.MohammedAlghafri.Board_API.Response.BoardDetailsResponse;
import com.MohammedAlghafri.Board_API.Service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")

public class BoardController {


    private final BoardService boardService;

    @Autowired
    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/boards")
    public ResponseEntity<List<BoardDetailsResponse>> getBoards() {
        List<Board> boards = boardService.getAllBoards();

        // Convert the list of boards to a list of board details responses
        List<BoardDetailsResponse> boardResponses = boards.stream()
                .map(this::mapBoardToResponse)
                .collect(Collectors.toList());

        return new ResponseEntity<>(boardResponses, HttpStatus.OK);
    }

    @GetMapping("/boards/{boardId}")
    public ResponseEntity<BoardDetailsResponse> getBoard(@PathVariable Long boardId) {
        Board board = boardService.getBoardById(boardId);
        if (board == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        BoardDetailsResponse response = mapBoardToResponse(board);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/boards")
    public ResponseEntity<BoardCreateResponse> createBoard(@RequestBody BoardCreateRequest request) {
        Board board = boardService.createBoard(request.getTitle());

        BoardCreateResponse response = new BoardCreateResponse();
        response.setBoard_id(board.getId());
        response.setName(board.getTitle());

        // Assuming columns are fixed for all newly created boards.
        Map<Integer, String> columns = new HashMap<>();
        columns.put(1, "To do");
        columns.put(2, "In progress");
        columns.put(3, "Done");
        response.setColumns(columns);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/boards/{boardId}")
    public ResponseEntity<BoardDetailsResponse> updateBoardName(
            @PathVariable Long boardId,
            @RequestBody Map<String, String> requestBody
    ) {
        String newName = requestBody.get("name");
        if (newName == null || newName.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Board board = boardService.updateBoardName(boardId, newName);

        if (board == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        BoardDetailsResponse response = mapBoardToResponse(board);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/boards/{boardId}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long boardId) {
        boolean isDeleted = boardService.deleteBoardById(boardId);
        if (isDeleted) {
            return ResponseEntity.ok().body(
                    Map.of("successful", true, "message", "Board with ID " + boardId + " has been deleted successfully.")
            );
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private BoardDetailsResponse mapBoardToResponse(Board board) {
        BoardDetailsResponse response = new BoardDetailsResponse();
        response.setBoard_id(board.getId());
        response.setName(board.getTitle());

        // Assuming columns are fixed for all boards.
        Map<Integer, String> columns = new HashMap<>();
        columns.put(1, "To do");
        columns.put(2, "In progress");
        columns.put(3, "Done");
        response.setColumns(columns);

        return response;
    }

}
