from fastapi import FastAPI, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from infra.sqlalchemy.config.database import get_db, criar_bd
from uuid import UUID, uuid4
from schemas.schemas import Montadora, ModeloVeiculo, Veiculo
from infra.sqlalchemy.repositorios.montadoras import MontadoraRepositorio
import uuid


app = FastAPI()

criar_bd()

origins = ['http://localhost:5500']

banco_montadoras: List[Montadora] = []
banco_modelos: List[ModeloVeiculo] = []
banco_veiculos: List[Veiculo] = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas Montadora
@app.get("/montadoras_list")
def montadora_list(db: Session = Depends(get_db)):
    montadoras = MontadoraRepositorio(db).listar()
    return montadoras

@app.post("/montadoras_save")
def montadora_save(montadora: Montadora, db: Session = Depends(get_db)):
    montadora_criada = MontadoraRepositorio(db).salvar(montadora)
    return montadora_criada
    
@app.put("/montadoras_update/{uuid}")
async def atualizar_montadora(uuid: str, montadora_atualizada: Montadora):
    for index, montadora in enumerate(banco_montadoras):
        if montadora.uuid == uuid:
            banco_montadoras[index] = montadora_atualizada
            banco_montadoras[index].uuid = uuid
            return {"mensagem": f"Montadora {montadora_atualizada.nome} atualizada com sucesso"}
    raise HTTPException(status_code=404, detail="Montadora não encontrada")

@app.delete("/montadoras_delete/{id}")
def montadora_delete(id: uuid.UUID, db: Session = Depends(get_db)):
    montadora_removida = MontadoraRepositorio(db).remover(id)
    if not montadora_removida:
        raise HTTPException(status_code=404, detail="Montadora não encontrada")
    return {"mensagem": f"Montadora {montadora_removida.nome} removida com sucesso"}

# Rotas ModeloVeiculo
@app.get("/modelos_list")
def modelo_list():
    return banco_modelos

@app.post("/modelos_save")
def modelo_save(modelo: ModeloVeiculo):
    montadora_existe = any(montadora.uuid == modelo.montadora_id for montadora in banco_montadoras)
    if not montadora_existe:
        raise HTTPException(status_code=400, detail="Montadora não encontrada")

    modelo.id = str(uuid4())
    banco_modelos.append(modelo)
    return {"mensagem": f"Modelo {modelo.nome} criado com sucesso"}

@app.put("/modelos_update/{id}")
async def atualizar_modelo(id: str, modelo_atualizado: ModeloVeiculo):
    for index, modelo in enumerate(banco_modelos):
        if modelo.id == id:
            banco_modelos[index] = modelo_atualizado
            banco_modelos[index].id = id
            return {"mensagem": f"Modelo {modelo_atualizado.nome} atualizado com sucesso"}
    raise HTTPException(status_code=404, detail="Modelo não encontrado")

@app.delete("/modelos_delete/{id}")
async def remover_modelo(id: str):
    for modelo in banco_modelos:
        if modelo.id == id:
            banco_modelos.remove(modelo)
            return {"mensagem": f"Modelo {modelo.nome} removido com sucesso"}
    raise HTTPException(status_code=404, detail="Modelo não encontrado")

# Rotas Veiculo
@app.get("/veiculos_list")
def veiculo_list():
    return banco_veiculos

@app.post("/veiculos_save")
def veiculo_save(veiculo: Veiculo):
    modelo_existe = any(modelo.id == veiculo.modelo_id for modelo in banco_modelos)
    if not modelo_existe:
        raise HTTPException(status_code=400, detail="Modelo não encontrado")

    veiculo.id = str(uuid4())
    banco_veiculos.append(veiculo)
    return {"mensagem": f"Veículo com placa {veiculo.placa} criado com sucesso"}

@app.put("/veiculos_update/{id}")
async def atualizar_veiculo(id: str, veiculo_atualizado: Veiculo):
    for index, veiculo in enumerate(banco_veiculos):
        if veiculo.id == id:
            banco_veiculos[index] = veiculo_atualizado
            banco_veiculos[index].id = id
            return {"mensagem": f"Veículo com placa {veiculo_atualizado.placa} atualizado com sucesso"}
    raise HTTPException(status_code=404, detail="Veículo não encontrado")

@app.delete("/veiculos_delete/{id}")
async def remover_veiculo(id: str):
    for veiculo in banco_veiculos:
        if veiculo.id == id:
            banco_veiculos.remove(veiculo)
            return {"mensagem": f"Veículo com placa {veiculo.placa} removido com sucesso"}
    raise HTTPException(status_code=404, detail="Veículo não encontrado")