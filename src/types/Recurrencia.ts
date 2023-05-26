import { TipoRecurrenciaProgresion } from "./Enums";

export interface RecurrenciaBase {
  fecha_diagnostico: Date;
  fecha_estimada: boolean;
  tipo: TipoRecurrenciaProgresion;
  detalle_topografia_recurrencia: string;
}

export interface RecurrenciaCreate extends RecurrenciaBase {}

export interface RecurrenciaUpdate extends RecurrenciaBase {
  id: number;
}

export interface Recurrencia extends RecurrenciaBase {
  id: number;
  seguimiento_id: number | null;
  caso_registro_id: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * RecurrenciaFormValues interface, used for representing the values of the
 * recurrencia form before submitting it. When we submit this form, we will
 * create a new RecurrenciaCreate object with the values of this interface.
 */
export interface RecurrenciaFormValues {
  fecha_diagnostico: Date | null;
  fecha_estimada: boolean;
  tipo: TipoRecurrenciaProgresion | null;
  detalle_topografia_recurrencia: string | null;
}
