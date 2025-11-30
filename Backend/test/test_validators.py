from app.utils.validators import validate_email

def test_validate_email_valid():
    """Teste des adresses e-mail valides."""
    assert validate_email("test@example.com") == True
    assert validate_email("user.name+tag@domain.co.uk") == True

def test_validate_email_invalid():
    """Teste des adresses e-mail invalides."""
    assert validate_email("plainaddress") == False
    assert validate_email("@missingusername.com") == False
    assert validate_email("username@.com") == False
    assert validate_email("username@domain.c") == False
    assert validate_email("username@domain..com") == False
