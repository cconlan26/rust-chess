use wasm_bindgen::prelude::*;
use chess::{ChessMove, Color, File, Game, GameResult, MoveGen, Piece, Rank, Square};
use rand::Rng;

#[wasm_bindgen]
pub struct SquareWrapper(Square);

impl SquareWrapper {
    pub fn get_rank_and_file(&self) -> Position {
        Position(self.0.get_rank().to_index(), self.0.get_file().to_index())
    }
}

// (Rank, File)
#[wasm_bindgen]
#[derive(Clone)]
pub struct Position(usize, usize);

#[wasm_bindgen]
#[derive(Clone)]
pub struct PositionSourceDest(Position, Position);

#[wasm_bindgen]
pub fn source_rank(psd: &PositionSourceDest) -> usize {
    psd.0.0
}

#[wasm_bindgen]
pub fn source_file(psd: &PositionSourceDest) -> usize {
    psd.0.1
}

#[wasm_bindgen]
pub fn dest_rank(psd: &PositionSourceDest) -> usize {
    psd.1.0
}

#[wasm_bindgen]
pub fn dest_file(psd: &PositionSourceDest) -> usize {
    psd.1.1
} 

#[wasm_bindgen]
pub struct GameHandler {
    game: Game
}

// TODO
/**
 * Add promotions
 */

#[wasm_bindgen]
pub enum GameState {
    OpponentTurn,
    Win,
    Lose,
    PlayerTurn,
    Stalemate,
    ShouldNotOccur
}

fn make_square_from_pos(position: Position) -> Square {
    Square::make_square(Rank::from_index(position.0), File::from_index(position.1))
}

#[wasm_bindgen]
pub fn make_move(game_handler: &mut GameHandler, source_rank: usize, source_file: usize, dest_rank: usize, dest_file: usize, is_player: bool) -> GameState {
    let chess_move =
        ChessMove::new(make_square_from_pos(Position(source_rank, source_file)), make_square_from_pos(Position(dest_rank, dest_file)), None);
    
    game_handler.game.make_move(chess_move);

    match game_handler.game.result() {
        Some(GameResult::BlackCheckmates) | Some(GameResult::WhiteCheckmates) => {
            if is_player {
                GameState::Win
            } else {
                GameState::Lose
            }
        },
        Some(GameResult::Stalemate) => GameState::Stalemate,
        None => {
            if is_player {
                GameState::OpponentTurn
            } else {
                GameState::PlayerTurn
            }
        },
        _ => GameState::ShouldNotOccur
    }
}

#[wasm_bindgen]
pub fn gen_random_move(game_handler: &mut GameHandler) -> PositionSourceDest {
    let all_moves = get_all_moves(game_handler);
    let rand_index = rand::thread_rng().gen_range(0..all_moves.len());
    all_moves.get(rand_index).unwrap().clone()
}

#[wasm_bindgen]
pub fn get_all_moves(game_handler: &GameHandler) -> Vec<PositionSourceDest> {
    let board = game_handler.game.current_position();
    let iterable = MoveGen::new_legal(&board);

    // Return initial opening moves
    let all_moves: Vec<PositionSourceDest> = iterable
        .map(|res| PositionSourceDest(SquareWrapper(res.get_source()).get_rank_and_file(), SquareWrapper(res.get_dest()).get_rank_and_file()))
        .collect();

    return all_moves;
}

#[wasm_bindgen]
pub fn get_piece_for_display(game_handler: &GameHandler, rank: usize, file: usize) -> char {
    let square = make_square_from_pos(Position(rank, file));
    let board = game_handler.game.current_position();
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

// Assume player is white
// TODO: Add black for player as well
#[wasm_bindgen]
pub fn gen_game() -> GameHandler {
    let game = Game::new();
    GameHandler {
       game
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn test_greet() {
//         assert_eq!(greet("Chris"), "Hello, Chris!")
//     }
// }