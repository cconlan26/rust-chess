use wasm_bindgen::prelude::*;
use chess::{ChessMove, Color, File, Game, MoveGen, Piece, Rank, Square};

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

// This is a fork of the existing status type from the chess crate
#[wasm_bindgen]
#[derive(Copy, Clone, PartialEq, PartialOrd, Debug)]
pub enum BoardStatus {
    Ongoing,
    Stalemate,
    Checkmate,
}

#[wasm_bindgen]
pub struct SquareWrapper(Square);

impl SquareWrapper {
    pub fn get_rank_and_file(&self) -> Position {
        Position(self.0.get_rank().to_index(), self.0.get_file().to_index())
    }
}

// (Rank, File)
#[wasm_bindgen]
pub struct Position(usize, usize);

#[wasm_bindgen]
pub struct PositionSourceDest(Position, Position);

impl PositionSourceDest {
    fn source_rank(&self) -> usize {
        self.0.0
    }

    fn source_file(&self) -> usize {
        self.0.1
    }

    fn dest_rank(&self) -> usize {
        self.1.0
    }

    fn dest_file(&self) -> usize {
        self.1.1
    }
}

#[wasm_bindgen]
pub fn source_rank(psd: &PositionSourceDest) -> usize {
    psd.source_rank()
}

#[wasm_bindgen]
pub fn source_file(psd: &PositionSourceDest) -> usize {
    psd.source_file()
}

#[wasm_bindgen]
pub fn dest_rank(psd: &PositionSourceDest) -> usize {
    psd.dest_rank()
}

#[wasm_bindgen]
pub fn dest_file(psd: &PositionSourceDest) -> usize {
    psd.dest_file()
} 

#[wasm_bindgen]
pub struct GameHandler {
    game: Game
}

// TODO
/**
 * Add promotions
 */

fn make_square_from_pos(position: Position) -> Square {
    Square::make_square(Rank::from_index(position.0), File::from_index(position.1))
}

impl GameHandler {
    pub fn make_move(&mut self, source: Position, dest: Position) -> bool {
        let chess_move = ChessMove::new(make_square_from_pos(source), make_square_from_pos(dest), None);
        self.game.make_move(chess_move)
    }

    pub fn get_all_moves(&self) -> Vec<PositionSourceDest> {
        let board = self.game.current_position();
        let iterable = MoveGen::new_legal(&board);

        // Return initial opening moves
        let all_moves: Vec<PositionSourceDest> = iterable
            .map(|res| PositionSourceDest(SquareWrapper(res.get_source()).get_rank_and_file(), SquareWrapper(res.get_dest()).get_rank_and_file()))
            .collect();

        return all_moves;
    }

    pub fn get_piece_for_display(&self, rank: usize, file: usize) -> char {
        let square = make_square_from_pos(Position(rank, file));
        let board = self.game.current_position();
        let maybe_piece = board.piece_on(square);
        
        match maybe_piece {
            Some(piece) => {
                let color = board.color_on(square).unwrap();

                match (piece, color) {
                    (Piece::Bishop, Color::Black) => '♝',
                    (Piece::King, Color::Black) => '♚',
                    (Piece::Knight, Color::Black) => '♞',
                    (Piece::Pawn, Color::Black) => '♟',
                    (Piece::Queen, Color::Black) => '♛',
                    (Piece::Rook, Color::Black) => '♜',
                    (Piece::Bishop, Color::White) => '♗',
                    (Piece::King, Color::White) => '♔',
                    (Piece::Knight, Color::White) => '♘',
                    (Piece::Pawn, Color::White) => '♙',
                    (Piece::Queen, Color::White) => '♕',
                    (Piece::Rook, Color::White) => '♖',
                }             
            }
            None => {
                ' '
            }
        }
    }
}

#[wasm_bindgen]
pub fn make_move(game_handler: &mut GameHandler, source_rank: usize, source_file: usize, dest_rank: usize, dest_file: usize) -> bool {
    game_handler.make_move(Position(source_rank, source_file), Position(dest_rank, dest_file))
    // TODO: calculate move from opponent and update board accordingly
}

#[wasm_bindgen]
pub fn get_all_moves(game_handler: &GameHandler) -> Vec<PositionSourceDest> {
    game_handler.get_all_moves()
}

#[wasm_bindgen]
pub fn get_piece_for_display(game_handler: &GameHandler, rank: usize, file: usize) -> char {
    game_handler.get_piece_for_display(rank, file)
}

// Assume player is white
// TODO: Add black for player as well
#[wasm_bindgen]
pub fn gen_game() -> GameHandler {
    let game = Game::new();
    GameHandler {
       game
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        assert_eq!(greet("Chris"), "Hello, Chris!")
    }
}