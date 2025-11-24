from ..extensions import db
from datetime import datetime

class Request(db.Model):
    __tablename__ = "requests"

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey("providers.id"), nullable=False)
    service_type_id = db.Column(db.Integer, db.ForeignKey("service_types.id"), nullable=False)

    status = db.Column(db.String(50), default="pending")
    description= db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=True)
    adress = db.Column(db.String(255), nullable=True)

    create_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    client = db.relationship("User", backref="requests", foreign_keys=[client_id])
    provider = db.relationship("Provider", backref="requests", foreign_keys=[provider_id])
    service_type = db.relationship("ServiceType", backref="requests")

    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "provider_id": self.provider_id,
            "service_type_id": self.service_type_id,
            "status": self.status,
            "description": self.description,
            "price": self.price,
            "adress": self.adress,
            "create_at": self.create_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }