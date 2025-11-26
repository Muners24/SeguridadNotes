from pymongo import MongoClient
import bcrypt

# Conectar a MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["Notes"]  # Usar la misma base de datos que el backend
users_collection = db["Users"]  # Con mayúscula como en el backend

# Datos del admin
email = input("Email del admin: ")
password = input("Contraseña del admin: ")
name = input("Nombre del admin: ")

# Verificar si ya existe
existing = users_collection.find_one({"email": email})
if existing:
    print(f"El usuario con email {email} ya existe.")
    update_role = input("¿Deseas cambiar su rol a 'admin'? (s/n): ")
    if update_role.lower() == 's':
        users_collection.update_one(
            {"email": email},
            {"$set": {"rol": "admin"}}
        )
        print(f"Usuario {email} actualizado a rol 'admin'")
else:
    # Hash de la contraseña
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Crear usuario admin
    admin_user = {
        "rol": "admin",
        "name": name,
        "email": email,
        "password": hashed_password
    }
    
    result = users_collection.insert_one(admin_user)
    print(f"Usuario admin creado exitosamente con ID: {result.inserted_id}")

print(f"\nPuedes iniciar sesión con:")
print(f"Email: {email}")
print(f"Contraseña: {password}")
