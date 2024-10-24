from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class Montadora(BaseModel):
    uuid: Optional[UUID] = None
    nome: str
    pais: str
    ano: int

class ModeloVeiculo(BaseModel):
    id: Optional[UUID] = None
    nome: str
    montadora_id: str 
    valor_referencia: float
    motorizacao: float
    turbo: bool
    automatico: bool

    class Config:
        from_atributes = True

class Veiculo(BaseModel):
    id: Optional[UUID] = None
    modelo_id: str
    cor: str
    ano_fabricacao: int
    ano_modelo: int
    valor: float
    placa: str
    vendido: bool

    class Config:
        from_atributes = True