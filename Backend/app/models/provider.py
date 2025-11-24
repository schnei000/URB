from ..extensions import db
from datetime import datetime

class Provider(db.Model):
    __tablename__ = "providers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    specialization = db.Column(db.String(150), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Float, default=0.0)
    is_verified = db.Column(db.Boolean, default=False)
    available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="provider", uselist=False)   

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "specialization": self.specialization,
            "bio": self.bio,
            "rating": self.rating,
            "is_verified": self.is_verified,
            "available": self.available,
            "created_at": self.created_at.isoformat()
        }