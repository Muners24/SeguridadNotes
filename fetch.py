import requests
import json

# URL de tu endpoint
url = "https://localhost:7205/api/usuarios/cambiar-contraseña"

# Payload: Debe coincidir con la entidad E_Usuario
# Importante: El IdUsuario debe existir en la base de datos
payload_cambio_exitoso = {
    "IdUsuario": 1, 
    "IdRol": 1, # Estos campos pueden ser necesarios, ajusta a tu modelo E_Usuario
    "Nombre": "",
    "Correo": "",
    "Contraseña": "ContraseñaNuevaYSegura123!",
}

# La llamada al API
try:
    # Usar verify=False solo para desarrollo local con HTTPS
    response = requests.post(url, json=payload_cambio_exitoso, verify=False, timeout=10)
    
    # -----------------------------------------------------------
    print("--- Resultado de la Solicitud ---")
    print("Método/Ruta: POST", url)
    print("Status Code:", response.status_code)
    print("Response Body (JSON):", response.text)
    print("-----------------------------------")
    
except requests.exceptions.RequestException as e:
    print(f"Error al conectar con la API: {e}")