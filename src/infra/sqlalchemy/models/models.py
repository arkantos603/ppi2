from typing import Optional
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from infra.sqlalchemy.config.database import Base
import uuid

class Montadora(Base):
    __tablename__ = 'montadoras'
    id: Optional[UUID] = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome: str = Column(String, nullable=False)
    pais: str = Column(String, nullable=False)
    ano: int = Column(Integer, nullable=False)

class ModeloVeiculo(Base):
    __tablename__ = 'modelos_veiculo'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String)
    montadora_id = Column(UUID(as_uuid=True), ForeignKey('montadoras.id'))
    valor_referencia = Column(Float)
    motorizacao = Column(Float)
    turbo = Column(Boolean)
    automatico = Column(Boolean)

class Veiculo(Base):
    __tablename__ = 'veiculos'
    id: Optional[UUID] = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    modelo_id: UUID = Column(UUID(as_uuid=True), ForeignKey('modelos_veiculo.id'), nullable=False)
    cor: str = Column(String, nullable=False)
    ano_fabricacao: int = Column(Integer, nullable=False)
    ano_modelo: int = Column(Integer, nullable=False)
    valor: float = Column(Float, nullable=False)
    placa: str = Column(String, nullable=False)
    vendido: bool = Column(Boolean, nullable=False)