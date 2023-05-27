import { TipoRecurrenciaProgresion } from "./Enums";

export interface ProgresionBase {
  fecha_diagnostico: string;
  fecha_estimada: boolean;
  tipo: TipoRecurrenciaProgresion;
  detalle_topografia_progresion: string;
}

export interface ProgresionCreate extends ProgresionBase {}

export interface ProgresionUpdate extends ProgresionBase {
  id: number;
}

export interface Progresion extends ProgresionBase {
  id: number;
  seguimiento_id: number | null;
  caso_registro_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * ProgresionFormValues interface, used for representing the values of the
 * progresion form before submitting it. When we submit this form, we will
 * create a new ProgresionCreate object with the values of this interface.
 */
export interface ProgresionFormValues {
  fecha_diagnostico: Date | null;
  fecha_estimada: boolean;
  tipo: TipoRecurrenciaProgresion | null;
  detalle_topografia_progresion: string | null;
}
