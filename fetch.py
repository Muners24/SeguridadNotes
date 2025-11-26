import requests
import json

# URL de tu endpoint
url = "http://localhost:8000/notes/list/"

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTI0ZDhiNjc1MWU0OGFmOGQwYWY4ZDciLCJyb2wiOiJhZG1pbiIsImV4cCI6MTc2NDE2MDM0Mn0.wZblO5_TVRR3ss4TAfHVMHa_rGOrb5_g-HN6VC4NQ6c"

note = {
    "id": "6926c676c5157fc67504eeca"
}

# HEADER con el token
headers = {
    "Authorization": f"Bearer {token}"
}

try:
    # verify=False solo para desarrollo local con HTTPS sin certificados
    response = requests.get(url, headers=headers, verify=False, timeout=10)

    print("--- Resultado de la Solicitud ---")
    print("Método/Ruta: POST", url)
    print("Status Code:", response.status_code)
    print("Response Body (JSON):", response.text)
    print("-----------------------------------")

except requests.exceptions.RequestException as e:
    print(f"Error al conectar con la API: {e}")
