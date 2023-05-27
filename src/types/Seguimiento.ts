import {
  ClaseCaso,
  CondicionCaso,
  EstadoVital,
  SeguimientoState,
  TipoSeguimiento,
} from "./Enums";
import { EntryUpdate, EntryCreate, EntryDelete } from "./UtilitySchemas";
import { CasoRegistro } from "./CasoRegistro";
import { Usuario } from "./Usuario";

export interface SeguimientoBase {
  validacion_clase_caso: ClaseCaso | null;
  posee_recurrencia: boolean;
  posee_progresion: boolean;
  posee_metastasis: boolean;
  posee_tto: boolean;
  condicion_del_caso: CondicionCaso | null;
  ultimo_contacto: string | null;
  estado_vital: EstadoVital | null;
  fecha_defuncion: string | null;
  causa_defuncion: string | null;
  tiene_consulta_nueva: boolean;
  tiene_examenes: boolean;
  tiene_comite_oncologico: boolean;
  tiene_tratamiento: boolean;
}

export interface SeguimientoCreate extends SeguimientoBase {}

export interface SeguimientoUpdate extends SeguimientoBase {
  new_entries: EntryCreate[];
  updated_entries: EntryUpdate[];
  deleted_entries: EntryDelete[];
}

export interface Seguimiento extends SeguimientoBase {
  id: number;
  usuario_id: number | null;
  caso_registro_id: number;
  created_at: string;
  updated_at: string | null;
  fecha_asignacion: string | null;
  state: SeguimientoState;
  tipo_seguimiento: TipoSeguimiento;
  numero_seguimiento: number;
  usuario_asignado: Usuario | null;
  caso_registro_correspondiente: CasoRegistro;
  cierre_del_caso: boolean;
}
