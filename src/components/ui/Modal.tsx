import clsx from "clsx";
import Image from "next/image";
import _ from "lodash";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  Controller,
  useForm,
  useFormContext,
  SubmitHandler,
} from "react-hook-form";
import DatePicker from "./DatePicker";
import Checkbox from "./Checkbox";
import SelectInput from "./SelectInput";
import Button from "./Button";
import TextInput from "./TextInput";
import { Seguimiento } from "@/types/Seguimiento";
import { Metastasis, MetastasisFormValues } from "@/types/Metastasis";
import { Recurrencia, RecurrenciaFormValues } from "@/types/Recurrencia";
import { Progresion, ProgresionFormValues } from "@/types/Progresion";
import * as fns from "date-fns";
import {
  TratamientoEnFALP,
  TratamientoEnFALPFormValues,
} from "@/types/TratamientoEnFALP";
import {
  CategoriaTTO,
  IntencionTTO,
  TipoRecurrenciaProgresion,
} from "@/types/Enums";
import {
  defaultSubcategoriaTTOForCategoriaTTO,
  subcategoriaTTOForCategoriaTTO,
} from "@/utils/subcategoriaTTOSelector";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  filled?: boolean;
  icon?: string;
  disabled?: boolean;
  metastasis?: boolean;
  recurrencia?: boolean;
  progresion?: boolean;
  tratamiento?: boolean;
  morePatientInfo?: boolean;
  sign?: boolean;
  seguimiento: Seguimiento;
  setNewMetastasisList?: any;
  setNewRecurrenciaList?: any;
  setNewProgresionList?: any;
  setNewTratamientoList?: any;
}

export default function Modal(props: ButtonProps) {
  const {
    disabled,
    filled,
    icon,
    metastasis,
    recurrencia,
    progresion,
    tratamiento,
    seguimiento,
    setNewMetastasisList,
    setNewRecurrenciaList,
    setNewProgresionList,
    setNewTratamientoList,
    morePatientInfo,
    sign,
  } = props;

  const { control, register } = useFormContext();

  const caso = seguimiento.caso_registro_correspondiente;

  // ================ METASTASIS FORM =================

  const metastasisForm = useForm<MetastasisFormValues>({
    mode: "onChange",
    defaultValues: {
      fecha_diagnostico: null,
      fecha_estimada: false,
      detalle_topografia: null,
    },
  });

  const { watch: watchMetastasis } = metastasisForm;
  const detalle_topografia = watchMetastasis("detalle_topografia");
  const fecha_diagnostico = watchMetastasis("fecha_diagnostico");

  let [isOpenMetastasis, setIsOpenMetastasis] = useState(false);

  function closeModalMetastasis() {
    setIsOpenMetastasis(false);
  }

  function openModalMetastasis() {
    setIsOpenMetastasis(true);
  }

  const addMetastasis: SubmitHandler<MetastasisFormValues> = (data, event) => {
    event?.stopPropagation();
    if (data.fecha_diagnostico !== null && data.detalle_topografia !== null) {
      const newMetastasis: Metastasis = {
        id: 0, // Irrelevant, it will be assigned by the backend
        seguimiento_id: seguimiento.id,
        caso_registro_id: seguimiento.caso_registro_id,
        created_at: fns.format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        updated_at: fns.format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        fecha_diagnostico: fns.format(data.fecha_diagnostico, "yyyy-MM-dd"),
        fecha_estimada: data.fecha_estimada,
        detalle_topografia: data.detalle_topografia,
      };
      setNewMetastasisList((prev: Metastasis[]) => {
        return [...prev, newMetastasis];
      });
      closeModalMetastasis();
    }
    // TODO: this shouldn't close the modal, instead it should show an error
    closeModalMetastasis();
  };

  // ================ RECURRENCIA FORM =================

  const recurrenciaForm = useForm<RecurrenciaFormValues>({
    defaultValues: {
      fecha_diagnostico: null,
      fecha_estimada: false,
      tipo: null,
      detalle_topografia_recurrencia: null,
    },
  });

  const { watch: watchRecurrencia } = recurrenciaForm;
  const tipo = watchRecurrencia("tipo");
  const detalle_topografia_recurrencia = watchRecurrencia(
    "detalle_topografia_recurrencia"
  );
  const fecha_diagnostico_recurrencia = watchRecurrencia("fecha_diagnostico");

  let [isOpenRecurrencia, setIsOpenRecurrencia] = useState(false);

  function closeModalRecurrencia() {
    setIsOpenRecurrencia(false);
  }

  function openModalRecurrencia() {
    setIsOpenRecurrencia(true);
  }

  const addRecurrencia: SubmitHandler<RecurrenciaFormValues> = (data) => {
    if (
      data.fecha_diagnostico !== null &&
      data.tipo !== null &&
      data.detalle_topografia_recurrencia !== null
    ) {
      const newRecurrencia: Recurrencia = {
        id: 0, // Irrelevant, it will be assigned by the backend
        seguimiento_id: seguimiento.id,
        caso_registro_id: seguimiento.caso_registro_id,
        created_at: fns.format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        updated_at: fns.format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        fecha_diagnostico: fns.format(data.fecha_diagnostico, "yyyy-MM-dd"),
        fecha_estimada: data.fecha_estimada,
        tipo: data.tipo,
        detalle_topografia_recurrencia: data.detalle_topografia_recurrencia,
      };
      setNewRecurrenciaList((prev: Recurrencia[]) => {
        return [...prev, newRecurrencia];
      });
      closeModalRecurrencia();
    }
  };

  // ================ PROGRESION FORM =================

  const progresionForm = useForm<ProgresionFormValues>({
    defaultValues: {
      fecha_diagnostico: null, //
      fecha_estimada: false, //
      tipo: null, //
      detalle_topografia_progresion: null, //
    },
  });

  const { watch: watchProgresion } = progresionForm;
  const tipo_progresion = watchProgresion("tipo");
  const detalle_topografia_progresion = watchProgresion(
    "detalle_topografia_progresion"
  );
  const fecha_diagnostico_progresion = watchProgresion("fecha_diagnostico");

  let [isOpenProgresion, setIsOpenProgresion] = useState(false);

  function closeModalProgresion() {
    setIsOpenProgresion(false);
  }

  function openModalProgresion() {
    setIsOpenProgresion(true);
  }

  const addProgresion: SubmitHandler<ProgresionFormValues> = (data) => {
    if (
      data.fecha_diagnostico !== null &&
      data.tipo !== null &&
      data.detalle_topografia_progresion !== null
    ) {
      const newProgresion: Progresion = {
        id: 0, // Irrelevant, it will be assigned by the backend
        seguimiento_id: seguimiento.id,
        caso_registro_id: seguimiento.caso_registro_id,
        created_at: fns.format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        updated_at: fns.format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        fecha_diagnostico: fns.format(data.fecha_diagnostico, "yyyy-MM-dd"),
        fecha_estimada: data.fecha_estimada,
        tipo: data.tipo,
        detalle_topografia_progresion: data.detalle_topografia_progresion,
      };
      setNewProgresionList((prev: Progresion[]) => {
        return [...prev, newProgresion];
      });
      closeModalProgresion();
    }
  };

  // ================ TRATAMIENTO EN FALP FORM =================

  const tratamientoEnFALPForm = useForm<TratamientoEnFALPFormValues>({
    defaultValues: {
      medico: null,
      fecha_de_inicio: null,
      fecha_de_termino: null,
      en_tto: false,
      categoria_tto: null,
      subcategoria_tto: null,
      intencion_tto: null,
      observaciones: null,
    },
  });

  const { watch: watchTratamientoEnFALP } = tratamientoEnFALPForm;
  const medico = watchTratamientoEnFALP("medico");
  const fecha_de_inicio = watchTratamientoEnFALP("fecha_de_inicio");
  const fecha_de_termino = watchTratamientoEnFALP("fecha_de_termino");
  const categoria_tto = watchTratamientoEnFALP("categoria_tto");
  const subcategoria_tto = watchTratamientoEnFALP("subcategoria_tto");
  const intencion_tto = watchTratamientoEnFALP("intencion_tto");
  const observaciones = watchTratamientoEnFALP("observaciones");
  const en_tto = watchTratamientoEnFALP("en_tto");

  let [isOpenTratamiento, setIsOpenTratamiento] = useState(false);

  function closeModelTratamientoEnFALP() {
    setIsOpenTratamiento(false);
  }

  function openModelTratamientoEnFALP() {
    setIsOpenTratamiento(true);
  }

  const addTratamientoEnFALP: SubmitHandler<TratamientoEnFALPFormValues> = (
    data
  ) => {
    if (
      data.fecha_de_inicio !== null &&
      data.fecha_de_termino !== null &&
      data.categoria_tto !== null &&
      data.subcategoria_tto !== null &&
      data.intencion_tto !== null &&
      data.medico !== null &&
      data.observaciones !== null
    ) {
      const newTratamientoEnFALP: TratamientoEnFALP = {
        id: 0, // Irrelevant, it will be assigned by the backend
        seguimiento_id: seguimiento.id,
        caso_registro_id: seguimiento.caso_registro_id,
        created_at: fns.format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        updated_at: fns.format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        medico: data.medico,
        fecha_de_inicio: fns.format(data.fecha_de_inicio, "yyyy-MM-dd"),
        fecha_de_termino: fns.format(data.fecha_de_termino, "yyyy-MM-dd"),
        en_tto: data.en_tto,
        categoria_tto: data.categoria_tto,
        subcategoria_tto: data.subcategoria_tto,
        intencion_tto: data.intencion_tto,
        descripcion_de_la_prestacion: null, // TODO: Agregar campo en el formulario
        observaciones: data.observaciones,
      };
      setNewTratamientoList((prev: TratamientoEnFALP[]) => {
        return [...prev, newTratamientoEnFALP];
      });
      closeModelTratamientoEnFALP();
    }
  };

  // ================ MORE INFO MODAL =================

  let [isOpenMoreInfo, setIsOpenMoreInfo] = useState(false);

  function closeMoreInfo() {
    setIsOpenMoreInfo(false);
  }

  function openMoreInfo() {
    setIsOpenMoreInfo(true);
  }

  // ================ SIGN MODAL =================

  let [isOpenSign, setIsOpenSign] = useState(false);

  function closeSign() {
    setIsOpenSign(false);
  }

  function openSign() {
    setIsOpenSign(true);
  }

  return (
    <>
      <button
        {..._.omit(props, [
          "icon",
          "filled",
          "metastasis",
          "recurrencia",
          "progresion",
          "tratamiento",
          "morePatientInfo",
          "sign",
          "setNewMetastasisList",
          "setNewRecurrenciaList",
          "setNewProgresionList",
          "setNewTratamientoList",
        ])}
        onClick={() => {
          if (metastasis) {
            openModalMetastasis();
          } else if (recurrencia) {
            openModalRecurrencia();
          } else if (progresion) {
            openModalProgresion();
          } else if (tratamiento) {
            openModelTratamientoEnFALP();
          } else if (morePatientInfo) {
            openMoreInfo();
          } else if (sign) {
            openSign();
          }
        }}
        className={clsx(
          "h-10 rounded-lg border-2 border-primary text-sm tracking-wide",
          props.children ? "px-4" : "w-10",
          filled ? "bg-primary text-white" : "text-primary",
          disabled &&
            "border-primary border-opacity-0 bg-primary bg-opacity-50",
          props.className
        )}
      >
        {icon && props.children ? (
          <div className="flex items-center gap-3">
            <Image
              src={`/icons/${icon}.svg`}
              width={16}
              height={16}
              alt=""
              className="h-4 w-4"
            />
            <div>{props.children}</div>
          </div>
        ) : icon && !props.children ? (
          <Image
            src={`/icons/${icon}.svg`}
            width={16}
            height={16}
            alt=""
            className="m-auto h-4 w-4"
          />
        ) : (
          props.children
        )}
      </button>
      <Transition appear show={isOpenMetastasis} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30"
          onClose={closeModalMetastasis}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-visible rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      metastasisForm.handleSubmit(addMetastasis)(e);
                      e.stopPropagation();
                    }}
                  >
                    <div className="flex justify-between">
                      <Dialog.Title
                        as="h3"
                        className="pb-6 text-3xl font-bold leading-6 text-font"
                      >
                        Metástasis
                      </Dialog.Title>
                      <Button
                        type="button"
                        icon="cross"
                        clear
                        onClick={closeModalMetastasis}
                      />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-6">
                      <Controller
                        name="fecha_diagnostico"
                        control={metastasisForm.control}
                        render={({ field }) => (
                          <DatePicker label="Fecha Diagnóstico" {...field} />
                        )}
                      />
                      <Checkbox
                        label="Fecha Estimada"
                        {...metastasisForm.register("fecha_estimada")}
                      />
                      <div className="col-span-2">
                        <TextInput
                          label="Detalle Topografía"
                          {...metastasisForm.register("detalle_topografia")}
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <Button type="button" onClick={closeModalMetastasis}>
                        Cancelar
                      </Button>
                      <Button
                        filled
                        type="submit"
                        disabled={!detalle_topografia || !fecha_diagnostico}
                        title={
                          !detalle_topografia || !fecha_diagnostico
                            ? "Por favor complete todos los campos"
                            : ""
                        }
                      >
                        Agregar Metástasis
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenRecurrencia} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30"
          onClose={closeModalRecurrencia}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-visible rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      recurrenciaForm.handleSubmit(addRecurrencia)(e);
                      e.stopPropagation();
                    }}
                  >
                    <div className="flex justify-between">
                      <Dialog.Title
                        as="h3"
                        className="pb-6 text-3xl font-bold leading-6 text-font"
                      >
                        Recurrencia
                      </Dialog.Title>
                      <Button
                        icon="cross"
                        clear
                        onClick={closeModalRecurrencia}
                        type="button"
                      />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-6">
                      <Controller
                        name="fecha_diagnostico"
                        control={recurrenciaForm.control}
                        render={({ field }) => (
                          <DatePicker label="Fecha Diagnóstico" {...field} />
                        )}
                      />
                      <Checkbox
                        label="Fecha Estimada"
                        {...recurrenciaForm.register("fecha_estimada")}
                      />
                      <Controller
                        name="tipo"
                        control={recurrenciaForm.control}
                        defaultValue={TipoRecurrenciaProgresion.local}
                        render={({ field }) => (
                          <div className="col-span-2">
                            <SelectInput
                              label={"Tipo"}
                              options={[
                                TipoRecurrenciaProgresion.local,
                                TipoRecurrenciaProgresion.regional,
                                TipoRecurrenciaProgresion.metastasis,
                                TipoRecurrenciaProgresion.peritoneal,
                                TipoRecurrenciaProgresion.sin_informacion,
                              ]}
                              {...field}
                            />
                          </div>
                        )}
                      />
                      <div className="col-span-2">
                        <TextInput
                          label="Detalle Topografía Recurrencia"
                          {...recurrenciaForm.register(
                            "detalle_topografia_recurrencia"
                          )}
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <Button type="button" onClick={closeModalRecurrencia}>
                        Cancelar
                      </Button>
                      <Button
                        filled
                        type="submit"
                        disabled={
                          !tipo ||
                          !detalle_topografia_recurrencia ||
                          !fecha_diagnostico_recurrencia
                        }
                        title={
                          !tipo ||
                          !detalle_topografia_recurrencia ||
                          !fecha_diagnostico_recurrencia
                            ? "Por favor complete todos los campos"
                            : ""
                        }
                      >
                        Agregar Recurrencia
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenProgresion} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30"
          onClose={closeModalProgresion}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-visible rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      progresionForm.handleSubmit(addProgresion)(e);
                      e.stopPropagation();
                    }}
                  >
                    <div className="flex justify-between">
                      <Dialog.Title
                        as="h3"
                        className="pb-6 text-3xl font-bold leading-6 text-font"
                      >
                        Progresión
                      </Dialog.Title>
                      <Button
                        type="button"
                        icon="cross"
                        clear
                        onClick={closeModalProgresion}
                      />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-6">
                      <Controller
                        name="fecha_diagnostico"
                        control={progresionForm.control}
                        render={({ field }) => (
                          <DatePicker label="Fecha Diagnóstico" {...field} />
                        )}
                      />
                      <Checkbox
                        label="Fecha Estimada"
                        {...progresionForm.register("fecha_estimada")}
                      />
                      <Controller
                        name="tipo"
                        control={progresionForm.control}
                        defaultValue={TipoRecurrenciaProgresion.local}
                        render={({ field }) => (
                          <div className="col-span-2">
                            <SelectInput
                              label={"Tipo"}
                              options={[
                                TipoRecurrenciaProgresion.local,
                                TipoRecurrenciaProgresion.regional,
                                TipoRecurrenciaProgresion.metastasis,
                                TipoRecurrenciaProgresion.peritoneal,
                                TipoRecurrenciaProgresion.sin_informacion,
                              ]}
                              {...field}
                            />
                          </div>
                        )}
                      />
                      <div className="col-span-2">
                        <TextInput
                          label="Detalle Topografía Progresión"
                          {...progresionForm.register(
                            "detalle_topografia_progresion"
                          )}
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <Button type="button" onClick={closeModalProgresion}>
                        Cancelar
                      </Button>
                      <Button
                        filled
                        type="submit"
                        disabled={
                          !tipo_progresion ||
                          !detalle_topografia_progresion ||
                          !fecha_diagnostico_progresion
                        }
                        title={
                          !tipo_progresion ||
                          !detalle_topografia_progresion ||
                          !fecha_diagnostico_progresion
                            ? "Por favor complete todos los campos"
                            : ""
                        }
                      >
                        Agregar Progresión
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenTratamiento} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30"
          onClose={closeModelTratamientoEnFALP}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-visible rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      tratamientoEnFALPForm.handleSubmit(addTratamientoEnFALP)(
                        e
                      );
                      e.stopPropagation();
                    }}
                  >
                    <div className="flex justify-between">
                      <Dialog.Title
                        as="h3"
                        className="pb-6 text-3xl font-bold leading-6 text-font"
                      >
                        Tratamientos
                      </Dialog.Title>
                      <Button
                        type="button"
                        icon="cross"
                        clear
                        onClick={closeModelTratamientoEnFALP}
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-6">
                      <div className="col-span-3">
                        <TextInput
                          label="Médico"
                          {...tratamientoEnFALPForm.register("medico")}
                        />
                      </div>
                      <Controller
                        name="fecha_de_inicio"
                        control={tratamientoEnFALPForm.control}
                        render={({ field }) => (
                          <div>
                            <DatePicker label="Inicio" {...field} />
                          </div>
                        )}
                      />
                      <Controller
                        name="fecha_de_termino"
                        control={tratamientoEnFALPForm.control}
                        render={({ field }) => (
                          <DatePicker label="Término" {...field} />
                        )}
                      />
                      <Checkbox
                        label="Tratamiento"
                        {...tratamientoEnFALPForm.register("en_tto")}
                      />
                    </div>
                    <div className="pt-6 pb-4">Categorización Tratamiento</div>
                    <div className="grid grid-cols-3 items-center gap-6">
                      <Controller
                        name="categoria_tto"
                        control={tratamientoEnFALPForm.control}
                        defaultValue={
                          CategoriaTTO.cirugia_o_procedimiento_quirurgico
                        }
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
                        control={tratamientoEnFALPForm.control}
                        defaultValue={defaultSubcategoriaTTOForCategoriaTTO(
                          categoria_tto
                        )}
                        render={({ field }) => (
                          <SelectInput
                            label={"Subcategoría"}
                            options={subcategoriaTTOForCategoriaTTO(
                              categoria_tto
                            )}
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        name="intencion_tto"
                        control={tratamientoEnFALPForm.control}
                        defaultValue={IntencionTTO.curativo}
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
                          label="Observaciones"
                          {...tratamientoEnFALPForm.register("observaciones")}
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <Button
                        type="button"
                        onClick={closeModelTratamientoEnFALP}
                      >
                        Cancelar
                      </Button>
                      <Button
                        filled
                        type="submit"
                        disabled={
                          !medico ||
                          !fecha_de_inicio ||
                          !fecha_de_termino ||
                          !categoria_tto ||
                          !subcategoria_tto ||
                          !intencion_tto ||
                          !observaciones
                        }
                        title={
                          !medico ||
                          !fecha_de_inicio ||
                          !fecha_de_termino ||
                          !categoria_tto ||
                          !subcategoria_tto ||
                          !intencion_tto ||
                          !observaciones
                            ? "Por favor complete todos los campos"
                            : ""
                        }
                      >
                        Agregar Tratamiento
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenMoreInfo} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeMoreInfo}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-visible rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <div>
                    <div className="flex justify-between">
                      <Dialog.Title
                        as="h3"
                        className="pb-10 text-3xl font-bold leading-6 text-font"
                      >
                        Antecedentes Personales
                      </Dialog.Title>
                      <Button
                        type="button"
                        icon="cross"
                        clear
                        onClick={closeMoreInfo}
                      />
                    </div>
                    <div className="grid w-full grid-cols-6 gap-4 rounded-2xl p-2 text-left">
                      <div className="contents">
                        <div className="font-bold">Nombre Paciente</div>
                        <div className="col-span-5">
                          {caso?.nombre} {caso?.apellido}
                        </div>
                      </div>
                      <Separator />
                      <div className="contents">
                        <div className="font-bold">Ficha</div>
                        <div className="">{caso?.ficha}</div>
                        <div className="font-bold">RUT/DNI</div>
                        <div className="">{caso?.rut_dni}</div>
                        <div className="font-bold">N° Registro</div>
                        <div className="">{caso?.num_registro}</div>
                      </div>
                      <Separator />
                      <div className="contents">
                        <div className="font-bold">Categoría</div>
                        <div className="col-span-5">{caso?.categoria}</div>
                      </div>
                      <Separator />
                      <div className="contents">
                        <div className="font-bold">Subcategoría</div>
                        <div className="col-span-5">{caso?.subcategoria}</div>
                      </div>
                      <Separator />
                      <div className="contents">
                        <div className="font-bold">Fecha Diagnóstico</div>
                        <div className="">{caso?.fecha_dg.toString()}</div>
                        <div className="font-bold">Lateralidad</div>
                        <div className="">{caso?.lateralidad}</div>
                        <div className="font-bold">Estadío Diagnóstico</div>
                        <div className="">{caso?.estadio_dg}</div>
                      </div>
                      <Separator />
                      <div className="contents">
                        <div className="font-bold">Morfología</div>
                        <div className="col-span-5">{caso?.morfologia}</div>
                      </div>
                      <Separator />
                      <div className="contents">
                        <div className="font-bold">Topografía</div>
                        <div className="col-span-5">{caso?.topografia}</div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenSign} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeSign}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-visible rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={closeSign}>
                    <div className="flex justify-start">
                      <Dialog.Title
                        as="h3"
                        className="pb-6 text-3xl font-bold leading-6 text-font"
                      >
                        ¿Estás seguro/a de firmar seguimiento?
                      </Dialog.Title>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                      <Button type="button" onClick={closeSign}>
                        Cancelar
                      </Button>
                      <Button filled type="submit">
                        Firmar Seguimiento
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function Separator() {
  return <div className="col-span-6 h-[1px] w-full bg-zinc-400"></div>;
}
