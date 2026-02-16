# web/app.py

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.web.state import game
from app.web.state import daily_game
from app.core.vocabulary import is_valid_word

from app.engine.embeddings import preload_vocab

app = FastAPI()

@app.on_event("startup")
def startup_event():
    preload_vocab()  # carrega todos os vetores do VOCABULARY
    print("✅ Embeddings pré-carregados")

app.mount("/static", StaticFiles(directory="app/web/static"), name="static")
templates = Jinja2Templates(directory="app/web/templates")


class Guess(BaseModel):
    word: str


@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )


@app.post("/guess")
def guess(data: Guess):
    word = data.word.lower().strip()

    if not is_valid_word(word):
        return JSONResponse(
            {"error": "Palavra inválida"},
            status_code=400
        )

    result = game.guess(word)

    if "error" in result:
        return JSONResponse(result, status_code=400)

    return result


@app.post("/new-game")
def new_game():
    game.new_game()
    return {"status": "ok"}


@app.get("/audit")
def audit():
    return game.audit(limit=200)


@app.get("/hint")
def hint():
    return game.hint()


@app.post("/give-up")
def give_up():
    result = game.give_up()

    if "error" in result:
        return JSONResponse(result, status_code=400)

    return result

@app.get("/daily")
def get_daily():
    daily_game.ensure_today()
    
    return {
        "date": daily_game.daily_date,
        "guesses": daily_game.guesses,
        "finished": daily_game.finished,
        "total_words": daily_game.total_words
    }

@app.post("/daily/guess")
def daily_guess(data: Guess):
    result = daily_game.guess(data.word)

    if "error" in result:
        return JSONResponse(result, status_code=400)

    return result

@app.post("/daily/give-up")
def daily_give_up():
    result = daily_game.give_up()

    if "error" in result:
        return JSONResponse(result, status_code=400)

    return result
