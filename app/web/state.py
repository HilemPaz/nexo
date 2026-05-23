from app.core.game import Game

# session_id -> Game
games = {}


def get_game(session_id: str) -> Game:
    if session_id not in games:
        games[session_id] = Game()
    return games[session_id]


def reset_game(session_id: str):
    games[session_id] = Game()

