# core/game.py

import random
from app.engine.normalizer import normalize
from .vocabulary import VOCABULARY
from .ranking import build_ranking
from .proximity import classify


class Game:
    def __init__(self):
        self.new_game()

    def new_game(self):
        raw_secret = random.choice(list(VOCABULARY))
        self.secret_word = normalize(raw_secret)
        self.ranking = build_ranking(self.secret_word)

        self.guesses = []
        self.hints_used = 0
        self.finished = False
        self.total_words = len(self.ranking)

        # 🔹 NOVO: controle de desistência
        self.give_up_used = False

    def guess(self, word: str):
        if self.finished:
            return {"error": "Jogo finalizado"}

        normalized_word = normalize(word)

        if not normalized_word:
            return {"error": "Palavra inválida"}

        if normalized_word in self.guesses:
            return {"error": f"A palavra {normalized_word} já foi usada"}

        if normalized_word not in self.ranking:
            return {"error": "Palavra fora do vocabulário"}

        self.guesses.append(normalized_word)

        rank = self.ranking[normalized_word]
        proximity = classify(rank, self.total_words)

        if rank == 1:
            self.finished = True

        return {
            "word": normalized_word,
            "rank": rank,
            "proximity": proximity,
            "success": rank == 1,
            "finished": self.finished,
            "is_hint": False
        }

    def hint(self):
        if self.finished:
            return {"error": "Jogo finalizado"}

        self.hints_used += 1

        revealed_ranks = {
            self.ranking[word]
            for word in self.guesses
            if word in self.ranking
        }

        best_rank = min(revealed_ranks, default=self.total_words)

        if best_rank > 200:
            target_rank = 200
        else:
            target_rank = max(2, int(best_rank * 0.7))

        candidates = [
            (word, rank)
            for word, rank in self.ranking.items()
            if rank != 1
            and rank not in revealed_ranks
        ]

        candidates.sort(key=lambda x: abs(x[1] - target_rank))

        word, rank = candidates[0]

        self.guesses.append(word)

        proximity = classify(rank, self.total_words)

        return {
            "word": word,
            "rank": rank,
            "proximity": proximity,
            "success": False,
            "finished": False,
            "is_hint": True
        }

    # 🔹 NOVO: desistência da partida
    def give_up(self):
        if self.finished:
            return {"error": "Jogo finalizado"}

        self.finished = True
        self.give_up_used = True

        return {
            "give_up": True,
            "finished": True,
            "secret_word": self.secret_word,
            "guesses": self.guesses,
            "hints_used": self.hints_used
        }

    def audit(self, limit: int):
        return [
            {"rank": rank, "word": word}
            for word, rank in sorted(self.ranking.items(), key=lambda x: x[1])[:limit]
        ]
