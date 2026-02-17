# web/app.py

from fastapi import FastAPI, Request, Header
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.web.state import get_game, reset_game
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
def guess(data: Guess, x_session_id: str = Header(...)):
    game = get_game(x_session_id)

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
def new_game(x_session_id: str = Header(...)):
    reset_game(x_session_id)
    return {"status": "ok"}


@app.get("/audit")
def audit(x_session_id: str = Header(...)):
    game = get_game(x_session_id)
    return game.audit(limit=200)


@app.get("/hint")
def hint(x_session_id: str = Header(...)):
    game = get_game(x_session_id)
    return game.hint()


@app.post("/give-up")
def give_up(x_session_id: str = Header(...)):
    game = get_game(x_session_id)
    result = game.give_up()

    if "error" in result:
        return JSONResponse(result, status_code=400)

    return result

