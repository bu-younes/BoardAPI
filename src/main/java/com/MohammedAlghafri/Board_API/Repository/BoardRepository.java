package com.MohammedAlghafri.Board_API.Repository;


import com.MohammedAlghafri.Board_API.Models.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
}
