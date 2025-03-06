import re
from datetime import date, datetime as dt


def generate_username(email):
    """
    Generates a username based on the provided email address
    """
    email = email.lower()

    match = re.match(r"([^.]+)(@)([^.]+)\.([^.]+)", email)

    username_prefix = match.group(1)[:6]
    domain_prefix = match.group(3)[1]
    domain_length = len(match.group(3))
    domain_suffix = match.group(3)[-1]
    timestamp = dt.now().strftime('%f')

    # Handle email starting with a digit
    if username_prefix[0].isdigit():
        username_prefix = "u" + username_prefix[:6]

    username = username_prefix + '_' + domain_suffix + str(domain_length) + domain_prefix + timestamp

    return username.lower()
