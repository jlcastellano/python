from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Optional

app = FastAPI(title="API de Usuarios", version="1.0.0")

# Modelo de Usuario
class Usuario(BaseModel):
    nombre: str
    email: str
    edad: int
    activo: bool = True

class UsuarioActualizar(BaseModel):
    nombre: Optional[str] = None
    email: Optional[str] = None
    edad: Optional[int] = None
    activo: Optional[bool] = None

# Base de datos simulada
usuarios_db: Dict[int, Usuario] = {}
contador_id = 1


# CREATE - Crear usuario
@app.post(
    "/usuarios/",
    response_model=Dict,
    status_code=status.HTTP_201_CREATED,
    tags=["Usuarios"]
)
def crear_usuario(usuario: Usuario):
    """
    Crea un nuevo usuario.
    
    - **nombre**: Nombre completo del usuario
    - **email**: Email del usuario
    - **edad**: Edad del usuario
    - **activo**: Estado del usuario (default: True)
    """
    global contador_id
    
    usuarios_db[contador_id] = usuario
    usuario_creado = {
        "id": contador_id,
        **usuario.dict()
    }
    contador_id += 1
    
    return {
        "mensaje": "Usuario creado exitosamente",
        "usuario": usuario_creado
    }


# READ - Obtener todos los usuarios
@app.get("/usuarios/", tags=["Usuarios"])
def listar_usuarios(
    skip: int = 0,
    limit: int = 10,
    activo: Optional[bool] = None
):
    """
    Lista todos los usuarios con paginación y filtros opcionales.
    """
    usuarios = []
    
    for id, usuario in usuarios_db.items():
        # Filtrar por estado si se especifica
        if activo is not None and usuario.activo != activo:
            continue
        
        usuarios.append({
            "id": id,
            **usuario.dict()
        })
    
    # Aplicar paginación
    usuarios_paginados = usuarios[skip: skip + limit]
    
    return {
        "total": len(usuarios),
        "skip": skip,
        "limit": limit,
        "usuarios": usuarios_paginados
    }


# READ - Obtener un usuario específico
@app.get("/usuarios/{usuario_id}", tags=["Usuarios"])
def obtener_usuario(usuario_id: int):
    """
    Obtiene un usuario por su ID.
    """
    if usuario_id not in usuarios_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {usuario_id} no encontrado"
        )
    
    return {
        "id": usuario_id,
        **usuarios_db[usuario_id].dict()
    }


# UPDATE - Actualizar usuario completo
@app.put("/usuarios/{usuario_id}", tags=["Usuarios"])
def actualizar_usuario(usuario_id: int, usuario: Usuario):
    """
    Actualiza todos los datos de un usuario.
    """
    if usuario_id not in usuarios_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {usuario_id} no encontrado"
        )
    
    usuarios_db[usuario_id] = usuario
    
    return {
        "mensaje": "Usuario actualizado exitosamente",
        "usuario": {
            "id": usuario_id,
            **usuario.dict()
        }
    }


# UPDATE - Actualizar parcialmente
@app.patch("/usuarios/{usuario_id}", tags=["Usuarios"])
def actualizar_parcial_usuario(usuario_id: int, usuario: UsuarioActualizar):
    """
    Actualiza parcialmente los datos de un usuario.
    Solo actualiza los campos proporcionados.
    """
    if usuario_id not in usuarios_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {usuario_id} no encontrado"
        )
    
    usuario_actual = usuarios_db[usuario_id]
    
    # Actualizar solo los campos proporcionados
    datos_actualizados = usuario.dict(exclude_unset=True)
    usuario_actualizado = usuario_actual.copy(update=datos_actualizados)
    
    usuarios_db[usuario_id] = usuario_actualizado
    
    return {
        "mensaje": "Usuario actualizado parcialmente",
        "usuario": {
            "id": usuario_id,
            **usuario_actualizado.dict()
        }
    }


# DELETE - Eliminar usuario
@app.delete(
    "/usuarios/{usuario_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Usuarios"]
)
def eliminar_usuario(usuario_id: int):
    """
    Elimina un usuario por su ID.
    """
    if usuario_id not in usuarios_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {usuario_id} no encontrado"
        )
    
    del usuarios_db[usuario_id]
    
    return None  # 204 No Content no retorna body


# Endpoint adicional: Estadísticas
@app.get("/usuarios/estadisticas/resumen", tags=["Estadísticas"])
def obtener_estadisticas():
    """
    Obtiene estadísticas generales de los usuarios.
    """
    total_usuarios = len(usuarios_db)
    usuarios_activos = sum(1 for u in usuarios_db.values() if u.activo)
    usuarios_inactivos = total_usuarios - usuarios_activos
    
    if total_usuarios > 0:
        edad_promedio = sum(u.edad for u in usuarios_db.values()) / total_usuarios
    else:
        edad_promedio = 0
    
    return {
        "total_usuarios": total_usuarios,
        "usuarios_activos": usuarios_activos,
        "usuarios_inactivos": usuarios_inactivos,
        "edad_promedio": round(edad_promedio, 2)
    }