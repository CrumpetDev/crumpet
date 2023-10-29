import os
from base64 import b64decode, b64encode

from Crypto.Cipher import AES
from django.utils.crypto import get_random_string, pbkdf2

BLOCK_SIZE = 16
KEY = pbkdf2(
    os.environ.get("ENCRYPTION_KEY", ""), "salt_here", 100000
)  # derive a key from your encryption key and salt


# TODO: Replace this with custom implementation using pyca/cryptography or just store hashes instead
def encrypt(data):
    pad = BLOCK_SIZE - len(data) % BLOCK_SIZE
    data += pad * chr(pad)
    iv = get_random_string(16).encode("utf-8")
    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    return b64encode(iv + cipher.encrypt(data.encode("utf-8")))


def decrypt(data):
    data = b64decode(data)
    iv = data[:16]
    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    decrypted = cipher.decrypt(data[16:])
    pad = ord(decrypted[-1:])
    return decrypted[:-pad].decode("utf-8")
