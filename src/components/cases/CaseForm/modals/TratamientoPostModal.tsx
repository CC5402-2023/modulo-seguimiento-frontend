import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import DatePicker from "@/components/ui/DatePicker";
import Modal, { ModalProps, ModalRenderProps } from "@/components/ui/Modal";
import SelectInput from "@/components/ui/SelectInput";
import TextInput from "@/components/ui/TextInput";
import {
  CategoriaTTO,
  EntryType,
  IntencionTTO,
  LugarTTO,
  SubcategoriaTTOCirugiaOProcedimientoQuirurgico,
  SubcategoriaTTOOtro,
  SubcategoriaTTORadioterapia,
  SubcategoriaTTOTerapiaSistemica,
} from "@/types/Enums";
import { TratamientoPostDuranteFALPCreate } from "@/types/TratamientoPostDuranteFALP";
import { subcategoriaTTOForCategoriaTTO } from "@/utils/categorias";
import * as fns from "date-fns";
import { useContext } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UpdateDataContext } from "../context/updateData";

interface FormValues {
  fecha_de_inicio: Date;
  fecha_estimada: boolean;
  categoria_tto: CategoriaTTO;
  subcategoria_tto:
    | SubcategoriaTTOCirugiaOProcedimientoQuirurgico
    | SubcategoriaTTOTerapiaSistemica
    | SubcategoriaTTORadioterapia
    | SubcategoriaTTOOtro;
  lugar_tto: LugarTTO;
  intencion_tto: IntencionTTO;
  observaciones: string;
  numero_seguimiento?: number;
}

const ModalRender = (props: ModalRenderProps) => {
  const { handleClose } = props;
  const updateData = useContext(UpdateDataContext);

  const form = useForm<FormValues>({
    defaultValues: {
      fecha_estimada: false, //
    },
  });

  const { watch } = form;
  const categoria_tto = watch("categoria_tto");
  const subcategoria_TTO_options =
    subcategoriaTTOForCategoriaTTO(categoria_tto);

  const addTratamiento: SubmitHandler<FormValues> = (data) => {
    const newTratamiento: TratamientoPostDuranteFALPCreate = {
      ...data,
      updated_at: new Date().toISOString(),
      fecha_de_inicio: fns.format(data.fecha_de_inicio as Date, "yyyy-MM-dd"),
    };
    updateData?.setNewEntries((prev) => [
      ...prev,
      {
        entry_type: EntryType.tratamiento_post_durante_falp,
        entry_content: newTratamiento,
      },
    ]);
    handleClose();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(addTratamiento)(e);
        e.stopPropagation();
      }}
    >
      <div className="grid grid-cols-3 items-center gap-6">
        <Controller
          name="fecha_de_inicio"
          control={form.control}
          rules={{ required: true }}
          render={({ field }) => (
            <div>
              <DatePicker label="Inicio" {...field} />
            </div>
          )}
        />
        <Checkbox label="Fecha estimada" {...form.register("fecha_estimada")} />
      </div>
      <div className="pt-6 pb-4">Categorización Tratamiento</div>
      <div className="grid grid-cols-3 items-center gap-6">
        <Controller
          name="categoria_tto"
          control={form.control}
          defaultValue={CategoriaTTO.cirugia_o_procedimiento_quirurgico}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectInput
              label={"Categoría"}
              options={[
                CategoriaTTO.cirugia_o_procedimiento_quirurgico,
                CategoriaTTO.terapia_sistemica,
                CategoriaTTO.radioterapia,
                CategoriaTTO.otro,
              ]}
              {...field}
            />
          )}
        />
        <Controller
          name="subcategoria_tto"
          control={form.control}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectInput
              label={"Subcategoría"}
              options={subcategoria_TTO_options}
              {...field}
            />
          )}
        />
        <Controller
          name="intencion_tto"
          control={form.control}
          defaultValue={IntencionTTO.curativo}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectInput
              label={"Intención"}
              options={[
                IntencionTTO.curativo,
                IntencionTTO.paliativo,
                IntencionTTO.desconocido,
              ]}
              {...field}
            />
          )}
        />

        <Controller
          name="lugar_tto"
          control={form.control}
          defaultValue={LugarTTO.extra_sistema_sistema_privado}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectInput
              label={"Lugar Tratamiento"}
              options={[
                LugarTTO.extra_sistema_sistema_privado,
                LugarTTO.extra_sistema_sistema_publico,
                LugarTTO.otros,
              ]}
              {...field}
            />
          )}
        />

        <div className="col-span-3">
          <TextInput
            label="Observaciones"
            {...form.register("observaciones", { required: true })}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <Button type="button" onClick={handleClose}>
          Cancelar
        </Button>
        <Button filled type="submit" disabled={!form.formState.isValid}>
          Agregar Tratamiento
        </Button>
      </div>
    </form>
  );
};

export default function TratamientoEnFalpModal(props: Partial<ModalProps>) {
  return (
    <Modal
      title="Tratamientos"
      icon="plus"
      render={(renderProps) => <ModalRender {...renderProps} />}
      {...props}
    >
      Agregar
    </Modal>
  );
}