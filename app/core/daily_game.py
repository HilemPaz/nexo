# core/daily_game.py
from app.core.game import Game
from app.core.daily import get_daily_word
from app.engine.normalizer import normalize


class DailyGame(Game):

    def __init__(self):
        self.daily_date = None
        super().__init__()

    def new_game(self):
        raw_secret, today = get_daily_word()

        self.daily_date = today
        self.secret_word = normalize(raw_secret)
        self.ranking = self._build_ranking_safe(self.secret_word)

        self.guesses = []
        self.hints_used = 0
        self.finished = False
        self.total_words = len(self.ranking)
        self.give_up_used = False

    def ensure_today(self):
        """
        Garante que o jogo corresponde ao dia atual (UTC).
        """
        _, today = get_daily_word()

        if self.daily_date != today:
            self.new_game()

    def guess(self, word: str):
        self.ensure_today()
        return super().guess(word)

    def hint(self):
        self.ensure_today()
        return super().hint()

    def give_up(self):
        self.ensure_today()
        return super().give_up()

    def _build_ranking_safe(self, word):
        from app.core.ranking import build_ranking
        return build_ranking(word)

