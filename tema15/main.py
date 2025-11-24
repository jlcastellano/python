# Importar FastAPI
from fastapi import FastAPI

# Crear instancia de la aplicación
app = FastAPI()

# Definir una ruta (endpoint)
@app.get("/")
def raiz():
    """Endpoint raíz que retorna un saludo."""
    return {"mensaje": "¡Hola Mundo!"}

@app.get("/saludo")
def saludar():
    """Endpoint que retorna un saludo personalizado."""
    return {"mensaje": "Bienvenido a FastAPI"}