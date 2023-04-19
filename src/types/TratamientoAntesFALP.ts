import {
  CategoriaTTO,
  SubcategoriaTTOCirugiaOProcedimientoQuirurgico,
  SubcategoriaTTOTerapiaSistematica,
  SubcategoriaTTORadioterapia,
  SubcategoriaTTOOtro,
  IntencionTTO,
  LugarTTO,
} from "./Enums";

export interface TratamientoAntesFALPBase {
  fecha_de_inicio: Date;
  fecha_estimada: boolean;
  categoria_tto: CategoriaTTO;
  subcategoria_tto:
    | SubcategoriaTTOCirugiaOProcedimientoQuirurgico
    | SubcategoriaTTOTerapiaSistematica
    | SubcategoriaTTORadioterapia
    | SubcategoriaTTOOtro;
  lugar_tto: LugarTTO;
  intencion_tto: IntencionTTO;
  observaciones: string;
}

export interface TratamientoAntesFALPCreate extends TratamientoAntesFALPBase {}

export interface TratamientoAntesFALPUpdate extends TratamientoAntesFALPBase {
  id: number;
}

export interface TratamientoAntesFALP extends TratamientoAntesFALPBase {
  id: number;
  seguimiento_id?: number | null;
  caso_registro_id: number;
}
