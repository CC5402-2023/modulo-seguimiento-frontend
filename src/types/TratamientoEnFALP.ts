import {
  CategoriaTTO,
  SubcategoriaTTOCirugiaOProcedimientoQuirurgico,
  SubcategoriaTTOTerapiaSistematica,
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
    | SubcategoriaTTOTerapiaSistematica
    | SubcategoriaTTORadioterapia
    | SubcategoriaTTOOtro;
  intencion_tto: IntencionTTO;
  descripcion_de_la_prestacion?: string | null;
  observaciones: string;
}

export interface TratamientoEnFALPCreate extends TratamientoEnFALPBase {}

export interface TratamientoEnFALPUpdate extends TratamientoEnFALPBase {
  id: number;
}

export interface TratamientoEnFALP extends TratamientoEnFALPBase {
  id: number;
  seguimiento_id?: number | null;
  caso_registro_id: number;
  created_at: Date;
  updated_at?: Date | null;
}