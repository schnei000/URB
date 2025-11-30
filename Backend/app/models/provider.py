from ..extensions import db
from datetime import datetime

class Provider(db.Model):
    __tablename__ = "providers"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    service_type = db.Column(db.String(150), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Float, default=0.0)
    experience = db.Column(db.String(255), nullable=True)
    is_verified = db.Column(db.Boolean, default=False)
    available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # La relation est maintenant correcte grâce à la clé étrangère
    user = db.relationship("User", backref=db.backref("provider", uselist=False))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "specialization": self.specialization,
            "bio": self.bio,
            "rating": self.rating,
            "is_verified": self.is_verified,
            "available": self.available,
            "created_at": self.created_at.isoformat(),
            "user_info": self.user.to_dict() if self.user else None
        }