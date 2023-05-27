import { IntencionTTO } from "./Enums";

export interface ComiteBase {
  fecha_comite: string;
  intencion_tto: IntencionTTO;
  medico: string;
}

export interface ComiteCreate extends ComiteBase {}

export interface ComiteUpdate extends ComiteBase {
  id: number;
}

export interface Comite extends ComiteBase {
  id: number;
  seguimiento_id: number | null;
  caso_registro_id: number;
  created_at: string;
  updated_at: string;
}
