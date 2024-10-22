from sqlalchemy.orm import Session
from schemas import schemas
from infra.sqlalchemy.models import models
from uuid import UUID

class MontadoraRepositorio:
    def __init__(self, db: Session):
        self.db = db

    def listar(self):
        return self.db.query(models.Montadora).all()

    def salvar(self, montadora: schemas.Montadora):
        montadora_bd = models.Montadora(
            nome=montadora.nome,
            pais=montadora.pais,
            ano=montadora.ano
        )
        self.db.add(montadora_bd)
        self.db.commit()
        self.db.refresh(montadora_bd)
        return montadora_bd

    def atualizar(self, uuid: UUID, montadora: schemas.Montadora):
        montadora_bd = self.db.query(models.Montadora).filter(models.Montadora.id == uuid).first()
        if montadora_bd:
            montadora_bd.nome = montadora.nome
            montadora_bd.pais = montadora.pais
            montadora_bd.ano = montadora.ano
            self.db.commit()
            self.db.refresh(montadora_bd)
            return montadora_bd
        return None

    def remover(self, uuid: UUID):
        montadora_bd = self.db.query(models.Montadora).filter(models.Montadora.id == uuid).first()
        if montadora_bd:
            self.db.delete(montadora_bd)
            self.db.commit()
            return montadora_bd
        return None