export interface MetastasisBase {
  fecha_diagnostico: Date;
  fecha_estimada: boolean;
  detalle_topografia: string;
}

export interface MetastasisCreate extends MetastasisBase {}

export interface MetastasisUpdate extends MetastasisBase {
  id: number;
}

export interface Metastasis extends MetastasisBase {
  id: number;
  seguimiento_id: number | null;
  caso_registro_id: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * MetastasisFormValues interface, used for representing the values of the
 * metastasis form before submitting it. When we submit this form, we will
 * create a new MetastasisCreate object with the values of this interface.
 */
export interface MetastasisFormValues {
  fecha_diagnostico: Date | null;
  fecha_estimada: boolean;
  detalle_topografia: string | null;
}
