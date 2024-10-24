from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from infra.sqlalchemy.config.database import get_db, criar_bd
from uuid import UUID
from schemas.schemas import Montadora as MontadoraSchema, ModeloVeiculo as ModeloVeiculoSchema, Veiculo as VeiculoSchema
from infra.sqlalchemy.models.models import ModeloVeiculo
from infra.sqlalchemy.repositorios.montadoras import MontadoraRepositorio
from infra.sqlalchemy.repositorios.modelos import ModeloRepositorio
from infra.sqlalchemy.repositorios.veiculos import VeiculoRepositorio
import uuid

app = FastAPI()

criar_bd()

origins = ['http://localhost:5500', 'http://127.0.0.1:5500']

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
def montadora_save(montadora: MontadoraSchema, db: Session = Depends(get_db)):
    montadora_criada = MontadoraRepositorio(db).salvar(montadora)
    return montadora_criada
    
@app.put("/montadoras_update/{uuid}")
async def atualizar_montadora(uuid: UUID, montadora_atualizada: MontadoraSchema, db: Session = Depends(get_db)):
    montadora = MontadoraRepositorio(db).atualizar(uuid, montadora_atualizada)
    if not montadora:
        raise HTTPException(status_code=404, detail="Montadora não encontrada")
    return {"mensagem": f"Montadora {montadora.nome} atualizada com sucesso"}

@app.delete("/montadoras_delete/{id}")
def montadora_delete(id: uuid.UUID, db: Session = Depends(get_db)):
    montadora_removida = MontadoraRepositorio(db).remover(id)
    if not montadora_removida:
        raise HTTPException(status_code=404, detail="Montadora não encontrada")
    return {"mensagem": f"Montadora {montadora_removida.nome} removida com sucesso"}

# Rotas ModeloVeiculo
@app.get("/modelos_list")
def modelo_list(db: Session = Depends(get_db)):
    modelos = ModeloRepositorio(db).listar()
    return modelos

@app.post("/modelos_save")
def modelo_save(modelo: ModeloVeiculoSchema, db: Session = Depends(get_db)):
    modelo_criado = ModeloRepositorio(db).salvar(modelo)
    return modelo_criado

@app.put("/modelos_update/{id}")
async def atualizar_modelo(id: UUID, modelo_atualizado: ModeloVeiculoSchema, db: Session = Depends(get_db)):
    modelo_atualizado.montadora_id = UUID(modelo_atualizado.montadora_id)  # Certifica que o montadora_id é um UUID
    modelo = ModeloRepositorio(db).atualizar(id, modelo_atualizado)
    if not modelo:
        raise HTTPException(status_code=404, detail="Modelo não encontrado")
    return {"mensagem": f"Modelo {modelo.nome} atualizado com sucesso"}

@app.delete("/modelos_delete/{id}")
def modelo_delete(id: UUID, db: Session = Depends(get_db)):
    modelo_removido = ModeloRepositorio(db).remover(id)
    if not modelo_removido:
        raise HTTPException(status_code=404, detail="Modelo não encontrado")
    return {"mensagem": f"Modelo {modelo_removido.nome} removido com sucesso"}

# Rotas Veiculo
@app.get("/veiculos_list")
def veiculo_list(db: Session = Depends(get_db)):
    veiculos = VeiculoRepositorio(db).listar()
    return veiculos

@app.post("/veiculos_save")
def veiculo_save(veiculo: VeiculoSchema, db: Session = Depends(get_db)):
    try:
        modelo_id = UUID(veiculo.modelo_id)  # Certifica que o modelo_id é um UUID
    except ValueError:
        raise HTTPException(status_code=400, detail="Modelo ID inválido")

    modelo_existe = db.query(ModeloVeiculo).filter(ModeloVeiculo.id == modelo_id).first()
    if not modelo_existe:
        raise HTTPException(status_code=400, detail="Modelo não encontrado")

    veiculo_criado = VeiculoRepositorio(db).salvar(veiculo)
    return veiculo_criado 

@app.put("/veiculos_update/{id}")
async def atualizar_veiculo(id: UUID, veiculo_atualizado: VeiculoSchema, db: Session = Depends(get_db)):
    try:
        if isinstance(veiculo_atualizado.modelo_id, str):
            veiculo_atualizado.modelo_id = UUID(veiculo_atualizado.modelo_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Modelo ID inválido")

    veiculo = VeiculoRepositorio(db).atualizar(id, veiculo_atualizado)
    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    return {"mensagem": f"Veículo com placa {veiculo_atualizado.placa} atualizado com sucesso"}

@app.delete("/veiculos_delete/{id}")
async def remover_veiculo(id: UUID, db: Session = Depends(get_db)):
    veiculo_removido = VeiculoRepositorio(db).remover(id)
    if not veiculo_removido:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    return {"mensagem": f"Veículo com placa {veiculo_removido.placa} removido com sucesso"}