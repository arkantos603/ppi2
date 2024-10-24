from sqlalchemy.orm import Session
from schemas import schemas
from infra.sqlalchemy.models import models
from infra.sqlalchemy.repositorios.modelos import ModeloRepositorio
from uuid import UUID
from fastapi import HTTPException

class VeiculoRepositorio:
    def __init__(self, db: Session):
        self.db = db
        self.modelo_repositorio = ModeloRepositorio(db)

    def listar(self):
        return self.db.query(models.Veiculo).all()

    def salvar(self, veiculo: schemas.Veiculo):
        # Verificar se o modelo existe
        modelo_id = UUID(veiculo.modelo_id)  # Certifica que o modelo_id é um UUID
        if not self.modelo_repositorio.modelo_existe(modelo_id):
            raise HTTPException(status_code=400, detail="Modelo não encontrado")

        veiculo_bd = models.Veiculo(
            modelo_id=modelo_id,
            cor=veiculo.cor,
            ano_fabricacao=veiculo.ano_fabricacao,
            ano_modelo=veiculo.ano_modelo,
            valor=veiculo.valor,
            placa=veiculo.placa,
            vendido=veiculo.vendido
        )
        self.db.add(veiculo_bd)
        self.db.commit()
        self.db.refresh(veiculo_bd)
        return veiculo_bd

    def atualizar(self, uuid: UUID, veiculo: schemas.Veiculo):
        veiculo_bd = self.db.query(models.Veiculo).filter(models.Veiculo.id == uuid).first()
        if veiculo_bd:
            # Verifica se modelo_id é uma string e converte se necessário
            if isinstance(veiculo.modelo_id, str):
                veiculo_bd.modelo_id = UUID(veiculo.modelo_id)
            else:
                veiculo_bd.modelo_id = veiculo.modelo_id

            veiculo_bd.cor = veiculo.cor
            veiculo_bd.ano_fabricacao = veiculo.ano_fabricacao
            veiculo_bd.ano_modelo = veiculo.ano_modelo
            veiculo_bd.valor = veiculo.valor
            veiculo_bd.placa = veiculo.placa
            veiculo_bd.vendido = veiculo.vendido
            self.db.commit()
            self.db.refresh(veiculo_bd)
            return veiculo_bd
        return None


    def remover(self, uuid: UUID):
        veiculo_bd = self.db.query(models.Veiculo).filter(models.Veiculo.id == uuid).first()
        if veiculo_bd:
            self.db.delete(veiculo_bd)
            self.db.commit()
            return veiculo_bd
        return None