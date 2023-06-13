import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import DatePicker from "@/components/ui/DatePicker";
import Modal, { ModalProps, ModalRenderProps } from "@/components/ui/Modal";
import SelectInput from "@/components/ui/SelectInput";
import TextInput from "@/components/ui/TextInput";
import { CategoriaTTO, EntryType, IntencionTTO } from "@/types/Enums";
import { TratamientoEnFALPCreate } from "@/types/TratamientoEnFALP";
import { subcategoriaTTOForCategoriaTTO } from "@/utils/categorias";
import * as fns from "date-fns";
import { useContext } from "react";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { SeguimientoContext } from "../context/seguimiento";
import { SeguimientoForm } from "../../CaseForm";
import { useMutationUpdateSeguimiento } from "@/hooks/seguimiento";
import { SeguimientoUpdate } from "@/types/Seguimiento";
import { serializeSeguimientoUpdate } from "../serialization/serialization";
import { EditModalRenderProps } from "../lists/edition";

interface FormValues {
  medico: string;
  fecha_de_inicio: Date;
  fecha_de_termino: Date | null;
  en_tto: boolean;
  categoria_tto: CategoriaTTO;
  subcategoria_tto: string;
  intencion_tto: IntencionTTO;
  observaciones: string;
  descripcion_de_la_prestacion: string;
}

export const TratamientoEnFalpModalRender = (props: EditModalRenderProps) => {
  const { handleClose } = props;
  const seguimiento = useContext(SeguimientoContext);
  const upperForm = useFormContext<SeguimientoForm>();
  const form = useForm<FormValues>({
    defaultValues: {
      en_tto: false, //
    },
  });
  const { mutate, isLoading } = useMutationUpdateSeguimiento(seguimiento?.id);

  const { watch } = form;
  const categoria_tto = watch("categoria_tto");
  const en_tto = watch("en_tto");
  const subcategoria_TTO_options =
    subcategoriaTTOForCategoriaTTO(categoria_tto);

  if (!seguimiento) {
    return <></>;
  }

  const addTratamiento: SubmitHandler<FormValues> = (data) => {
    const entryContent: TratamientoEnFALPCreate = {
      ...data,
      updated_at: new Date().toISOString(),
      fecha_de_inicio: fns.format(data.fecha_de_inicio as Date, "yyyy-MM-dd"),
      fecha_de_termino: data.en_tto
        ? null
        : fns.format(data.fecha_de_termino as Date, "yyyy-MM-dd"),
    };
    const payload: SeguimientoUpdate = {
      ...serializeSeguimientoUpdate(upperForm.getValues(), seguimiento),
      [props.edit && props.data ? "updated_entries" : "new_entries"]: [
        {
          entry_type: EntryType.tratamiento_en_falp,
          entry_content: { id: props.data?.id || undefined, ...entryContent },
        },
      ],
    };
    mutate(payload, {
      onSuccess: () => {
        handleClose();
      },
    });
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
        <div className="col-span-3">
          <TextInput
            label="Médico"
            {...form.register("medico", { required: true })}
          />
        </div>
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
        <Controller
          name="fecha_de_termino"
          control={form.control}
          rules={{ required: !en_tto }}
          render={({ field }) => (
            <DatePicker label="Término" disabled={en_tto} {...field} />
          )}
        />
        <Checkbox label="En Tratamiento" {...form.register("en_tto")} />
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

        <div className="col-span-3">
          <TextInput
            label="Descripción de la prestación"
            {...form.register("descripcion_de_la_prestacion", {
              required: true,
            })}
          />
        </div>

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
        <Button
          filled
          type="submit"
          disabled={!form.formState.isValid}
          loading={isLoading}
        >
          {props.edit ? "Editar" : "Agregar"} Tratamiento
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
      render={(renderProps) => (
        <TratamientoEnFalpModalRender {...renderProps} />
      )}
      {...props}
    >
      Agregar
    </Modal>
  );
}
