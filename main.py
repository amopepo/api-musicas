from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI(
    title="🎵 API de Músicas",
    description="Testando como fazer uma API e bla bla bla",
    version="1.0.0",
    contact={
        "name": "Pedro Henrique",
    }
)

class Musica(BaseModel):
    id: int
    titulo: str
    artista: str
    genero: str
    link: Optional[str] = None

ARQUIVO_DB = "db.json"

def carregar_musicas():
    if not os.path.exists(ARQUIVO_DB):
        return []
    with open(ARQUIVO_DB, "r", encoding="utf-8") as f:
        return [Musica(**m) for m in json.load(f)]

def salvar_musicas(musicas: List[Musica]):
    with open(ARQUIVO_DB, "w", encoding="utf-8") as f:
        json.dump([m.dict() for m in musicas], f, indent=4, ensure_ascii=False)

@app.get("/", summary="Página inicial")
def home():
    return FileResponse("frontend/index.html")

@app.get("/musicas", summary="Listar músicas")
def listar_musicas():
    return carregar_musicas()

@app.post("/musicas", summary="Adicionar música")
def criar_musica(musica: Musica):
    musicas = carregar_musicas()
    musicas.append(musica)
    salvar_musicas(musicas)
    return {"mensagem": "Música adicionada!", "musica": musica}

@app.delete("/musicas/{musica_id}", summary="Remover música")
def deletar_musica(musica_id: int):
    musicas = carregar_musicas()
    musicas = [m for m in musicas if m.id != musica_id]
    salvar_musicas(musicas)
    return {"mensagem": "Música removida com sucesso"}

app.mount("/static", StaticFiles(directory="frontend"), name="static")
