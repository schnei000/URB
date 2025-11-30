from flask import current_app, render_template
from flask_mail import Message
from ..extensions import mail

def send_email(to, subject, template, **kwargs):
    """
    Fonction générique pour envoyer des e-mails.
    """
    app = current_app._get_current_object()
    msg = Message(
        subject,
        recipients=[to],
        sender=app.config['MAIL_DEFAULT_SENDER']
    )
    msg.body = render_template(template + '.txt', **kwargs)
    msg.html = render_template(template + '.html', **kwargs)
    
    # Dans un environnement de développement, vous pouvez imprimer l'e-mail au lieu de l'envoyer
    # print(msg) 
    
    # Pour envoyer l'e-mail (nécessite une configuration du serveur SMTP)
    # mail.send(msg)
    print(f"Email '{subject}' prêt à être envoyé à {to}")
