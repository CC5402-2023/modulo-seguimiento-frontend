import {
  CategoriaTTO,
  SubcategoriaTTOCirugiaOProcedimientoQuirurgico,
  SubcategoriaTTOTerapiaSistemica,
  SubcategoriaTTORadioterapia,
  SubcategoriaTTOOtro,
} from "@/types/Enums";

export function defaultSubcategoriaTTOForCategoriaTTO(
  categoriaTTO: CategoriaTTO | null
) {
  // We match the given categoriaTTO, returning default value for each one
  switch (categoriaTTO) {
    case CategoriaTTO.cirugia_o_procedimiento_quirurgico:
      return SubcategoriaTTOCirugiaOProcedimientoQuirurgico.cirugia;
    case CategoriaTTO.terapia_sistemica:
      return SubcategoriaTTOTerapiaSistemica.quimioterapia;
    case CategoriaTTO.radioterapia:
      return SubcategoriaTTORadioterapia.radioterapia;
    case CategoriaTTO.otro:
      return SubcategoriaTTOOtro.cuidados_paliativos;
    case null:
      return null;
  }
}

export function subcategoriaTTOForCategoriaTTO(
  categoriaTTO: CategoriaTTO | null
) {
  // We match the given categoriaTTO, returning all possible values for each one
  switch (categoriaTTO) {
    case CategoriaTTO.cirugia_o_procedimiento_quirurgico:
      return Object.values(SubcategoriaTTOCirugiaOProcedimientoQuirurgico);
    case CategoriaTTO.terapia_sistemica:
      return Object.values(SubcategoriaTTOTerapiaSistemica);
    case CategoriaTTO.radioterapia:
      return Object.values(SubcategoriaTTORadioterapia);
    case CategoriaTTO.otro:
      return Object.values(SubcategoriaTTOOtro);
    case null:
      return [];
  }
}
