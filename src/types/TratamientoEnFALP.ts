import {
  CategoriaTTO,
  SubcategoriaTTOCirugiaOProcedimientoQuirurgico,
  SubcategoriaTTOTerapiaSistemica,
  SubcategoriaTTORadioterapia,
  SubcategoriaTTOOtro,
  IntencionTTO,
} from "./Enums";

export interface TratamientoEnFALPBase {
  medico: string;
  fecha_de_inicio: Date;
  fecha_de_termino: Date;
  en_tto: boolean;
  categoria_tto: CategoriaTTO;
  subcategoria_tto:
    | SubcategoriaTTOCirugiaOProcedimientoQuirurgico
    | SubcategoriaTTOTerapiaSistemica
    | SubcategoriaTTORadioterapia
    | SubcategoriaTTOOtro;

  intencion_tto: IntencionTTO;
  descripcion_de_la_prestacion: string | null;
  observaciones: string;
}

export interface TratamientoEnFALPCreate extends TratamientoEnFALPBase {}

export interface TratamientoEnFALPUpdate extends TratamientoEnFALPBase {
  id: number;
}

export interface TratamientoEnFALP extends TratamientoEnFALPBase {
  id: number;
  seguimiento_id: number | null;
  caso_registro_id: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * TratamientoEnFALPFormValues interface, used for representing the values of the
 * tratamiento en falp form before submitting it. When we submit this form, we will
 * create a new TratamientoEnFALPCreate object with the values of this interface.
 */
export interface TratamientoEnFALPFormValues {
  medico: string | null;
  fecha_inicio: Date | null;
  fecha_termino: Date | null;
  en_tto: boolean;
  categoria_tto: CategoriaTTO | null;
  subcategoria_tto:
    | SubcategoriaTTOCirugiaOProcedimientoQuirurgico
    | SubcategoriaTTOTerapiaSistemica
    | SubcategoriaTTORadioterapia
    | SubcategoriaTTOOtro
    | null;
  intencion_tto: IntencionTTO | null;
  observaciones: string | null;
}
