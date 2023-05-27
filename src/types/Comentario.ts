export interface ComentarioBase {
  comentario: string;
}

export interface ComentarioCreate extends ComentarioBase {}

export interface Comentario extends ComentarioBase {
  id: number;
  usuario_id: number;
  seguimiento_id: number;
  caso_registro_id: number;
  nombre_usuario: string;
  created_at: string;
}
