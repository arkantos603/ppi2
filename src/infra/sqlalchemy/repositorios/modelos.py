from sqlalchemy.orm import Session
from schemas import schemas
from infra.sqlalchemy.models import models
from infra.sqlalchemy.repositorios.montadoras import MontadoraRepositorio
from uuid import UUID

class MontadoraNaoEncontradaError(Exception):
    pass

class ModeloRepositorio:
    def __init__(self, db: Session):
        self.db = db

    def listar(self):
        return self.db.query(models.ModeloVeiculo).all()

    def salvar():
        pass

    def atualizar(self, uuid: UUID, modelo: schemas.ModeloVeiculo):
        modelo_bd = self.db.query(models.ModeloVeiculo).filter(models.ModeloVeiculo.id == uuid).first()
        if modelo_bd:
            modelo_bd.nome = modelo.nome
            modelo_bd.montadora_id = modelo.montadora_id
            modelo_bd.valor_referencia = modelo.valor_referencia
            modelo_bd.motorizacao = modelo.motorizacao
            modelo_bd.turbo = modelo.turbo
            modelo_bd.automatico = modelo.automatico
            self.db.commit()
            self.db.refresh(modelo_bd)
            return modelo_bd
        return None

    def remover(self, uuid: UUID):
        modelo_bd = self.db.query(models.ModeloVeiculo).filter(models.ModeloVeiculo.id == uuid).first()
        if modelo_bd:
            self.db.delete(modelo_bd)
            self.db.commit()
            return modelo_bd
        return None