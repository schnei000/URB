from ..extensions import db
from datetime import datetime

class Request(db.Model):
    __tablename__ = "requests"

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey("providers.id"), nullable=True) # Un prestataire est assigné plus tard
    service_type = db.Column(db.String(150), nullable=False) # Simplifié pour correspondre à la logique des routes

    status = db.Column(db.String(50), default="pending")
    description= db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=True)
    adress = db.Column(db.String(255), nullable=True)
    preferred_date = db.Column(db.String(100)) # Ajout du champ manquant
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    client = db.relationship("User", backref="requests", foreign_keys=[client_id])
    provider = db.relationship("Provider", backref="requests", foreign_keys=[provider_id])

    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "provider_id": self.provider_id,
            "service_type": self.service_type,
            "status": self.status,
            "description": self.description,
            "price": self.price,
            "adress": self.adress,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }