import { Fragment, useMemo, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import Button from "../ui/Button";
import Checkbox from "../ui/Checkbox";
import SelectInput from "../ui/SelectInput";
import DatePicker from "../ui/DatePicker";
import Modal from "../ui/Modal";
import MetastasisList from "./CaseForm/MetastasisList";
import RecurrenciaList from "./CaseForm/RecurrenciaList";
import ProgresionList from "./CaseForm/ProgresionList";
import TratamientoList from "./CaseForm/TratamientoList";
import MainLayout from "../ui/layout/MainLayout";
import Section from "../ui/layout/Section";
import BoundingBox from "../ui/layout/BoundingBox";
import Link from "next/link";
import { useQuery } from "react-query";
import { Seguimiento, SeguimientoUpdate } from "@/types/Seguimiento";
import { ClaseCaso, CondicionCaso, EntryType } from "@/types/Enums";
import { Metastasis } from "@/types/Metastasis";
import { Progresion } from "@/types/Progresion";
import * as fns from "date-fns";
import { Recurrencia } from "@/types/Recurrencia";
import { TratamientoEnFALP } from "@/types/TratamientoEnFALP";

const sections = [
  { id: "metastasis", name: "Metástasis" },
  { id: "recurrencia", name: "Recurrencia" },
  { id: "progresion", name: "Progresión" },
  { id: "tratamiento", name: "Tratamiento" },
  { id: "validacion", name: "Validación Antecedentes" },
];

interface CaseFormProps {
  seguimientoId: string;
}

export default function CaseForm(props: CaseFormProps) {
  const { seguimientoId } = props;

  const seguimientoQuery = useQuery<Seguimiento>({
    queryKey: ["seguimiento", seguimientoId],
    queryFn: () =>
      fetch(`http://localhost:8000/seguimiento/${seguimientoId}`).then((res) =>
        res.json()
      ),
  });

  const caso = useMemo(
    () => seguimientoQuery.data?.caso_registro_correspondiente,
    [seguimientoQuery.data]
  );

  const form = useForm({
    defaultValues: seguimientoQuery.data,
  });
  const { watch, register, handleSubmit, control } = form;
  const tieneMetastasis: boolean = useWatch({
    control,
    name: "posee_metastasis",
    defaultValue: false,
  });
  const tieneRecurrencia: boolean = useWatch({
    control,
    name: "posee_recurrencia",
    defaultValue: false,
  });
  const tieneProgresion: boolean = useWatch({
    control,
    name: "posee_progresion",
    defaultValue: false,
  });

  const validacionClaseCaso = watch("validacion_clase_caso");
  const condicion_del_caso = watch("condicion_del_caso");
  const ultimo_contacto = watch("ultimo_contacto");
  const estadoVital = watch("estado_vital");
  const fechaDefuncion = watch("fecha_defuncion");
  const causaDefuncion = watch("causa_defuncion");

  console.log(watch());

  const [newMetastasisList, setNewMetastasisList] = useState<Metastasis[]>([]);
  const [newRecurrenciaList, setNewRecurrenciaList] = useState<Recurrencia[]>(
    []
  );
  const [newProgresionList, setNewProgresionList] = useState<Progresion[]>([]);
  const [newTratamientoEnFALPList, setNewTratamientoEnFALPList] = useState<
    TratamientoEnFALP[]
  >([]);
  const [selectedSection, setSelectedSection] = useState(sections[0]);

  const seguimientoUpdateBody: SeguimientoUpdate = {
    validacion_clase_caso: validacionClaseCaso,
    posee_recurrencia: seguimientoQuery.data?.posee_recurrencia!,
    posee_progresion: seguimientoQuery.data?.posee_progresion!,
    posee_metastasis: seguimientoQuery.data?.posee_metastasis!,
    posee_tto: seguimientoQuery.data?.posee_tto!,
    condicion_del_caso: condicion_del_caso,
    ultimo_contacto: ultimo_contacto,
    estado_vital: estadoVital,
    fecha_defuncion: fechaDefuncion,
    causa_defuncion: causaDefuncion,
    tiene_consulta_nueva: seguimientoQuery.data?.tiene_consulta_nueva!,
    tiene_examenes: seguimientoQuery.data?.tiene_examenes!,
    tiene_comite_oncologico: seguimientoQuery.data?.tiene_comite_oncologico!,
    tiene_tratamiento: seguimientoQuery.data?.tiene_tratamiento!,
    new_entries: [],
    updated_entries: [],
    deleted_entries: [],
  };

  async function closeSeguimiento(seguimientoId: number) {
    fetch(`http://localhost:8000/seguimiento/sign/${seguimientoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seguimientoUpdateBody),
    })
      .then((response) => {
        // Manejar la respuesta de la petición aquí
        setNewMetastasisList([]);
        setNewRecurrenciaList([]);
        setNewProgresionList([]);
        setNewTratamientoEnFALPList([]);
        window.location.href = `/`;
      })
      .catch((error) => {
        // Manejar el error de la petición aquí
      });
  }

  async function updateSeguimiento(
    metastasisList: Metastasis[],
    recurrenciaList: Recurrencia[],
    progresionList: Progresion[],
    tratamientoEnFALPList: TratamientoEnFALP[]
  ) {
    // For each entry type, add the new entries to the new_entries array
    // TODO: Solve issue with date format
    metastasisList.forEach((metastasis) => {
      seguimientoUpdateBody.new_entries.push({
        entry_type: EntryType.metastasis,
        entry_content: {
          fecha_diagnostico: metastasis.fecha_diagnostico,
          fecha_estimada: metastasis.fecha_estimada,
          detalle_topografia: metastasis.detalle_topografia,
        },
      });
    });

    recurrenciaList.forEach((recurrencia) => {
      seguimientoUpdateBody.new_entries.push({
        entry_type: EntryType.recurrencia,
        entry_content: {
          fecha_diagnostico: recurrencia.fecha_diagnostico,
          fecha_estimada: recurrencia.fecha_estimada,
          tipo: recurrencia.tipo,
          detalle_topografia_recurrencia:
            recurrencia.detalle_topografia_recurrencia,
        },
      });
    });

    progresionList.forEach((progresion) => {
      seguimientoUpdateBody.new_entries.push({
        entry_type: EntryType.progresion,
        entry_content: {
          fecha_diagnostico: progresion.fecha_diagnostico,
          fecha_estimada: progresion.fecha_estimada,
          tipo: progresion.tipo,
          detalle_topografia_progresion:
            progresion.detalle_topografia_progresion,
        },
      });
    });

    tratamientoEnFALPList.forEach((tratamiento) => {
      seguimientoUpdateBody.new_entries.push({
        entry_type: EntryType.tratamiento_en_falp,
        entry_content: {
          medico: tratamiento.medico,
          fecha_de_inicio: tratamiento.fecha_de_inicio,
          fecha_de_termino: tratamiento.fecha_de_termino,
          en_tto: tratamiento.en_tto,
          categoria_tto: tratamiento.categoria_tto,
          subcategoria_tto: tratamiento.subcategoria_tto,
          intencion_tto: tratamiento.intencion_tto,
          descripcion_de_la_prestacion:
            tratamiento.descripcion_de_la_prestacion,
          observaciones: tratamiento.observaciones,
        },
      });
    });

    // Realizar la petición PUT a la API
    fetch(`http://localhost:8000/seguimiento/save/${seguimientoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seguimientoUpdateBody),
    })
      .then((response) => {
        // Manejar la respuesta de la petición aquí
        setNewMetastasisList([]);
        setNewRecurrenciaList([]);
        setNewProgresionList([]);
        setNewTratamientoEnFALPList([]);
        seguimientoQuery.refetch();
      })
      .catch((error) => {
        // Manejar el error de la petición aquí
      });
  }

  const headerHeight = 251;
  const handleSectionSelect = (value: { id: string; name: string }) => {
    const element = document.getElementById(value.id);
    element?.scrollIntoView({
      behavior: "auto",
    });
    window.scroll(0, window.scrollY - headerHeight);
    setSelectedSection(value);
  };

  const onSubmit = (data: any) => {
    // subimos a la api,,,
    // manejamos también newMetastasisList añadiendola a new_entries
    updateSeguimiento(
      newMetastasisList,
      newRecurrenciaList,
      newProgresionList,
      newTratamientoEnFALPList
    );
    //ahora guardar
    //o cerrar (sign)
    if (seguimientoQuery.data?.id) {
      closeSeguimiento(seguimientoQuery.data?.id);
    }
  };
  return (
    <FormProvider {...form}>
      <MainLayout>
        {seguimientoQuery.isSuccess && seguimientoQuery.data && (
          <>
            <div className="sticky top-0 z-30 bg-white">
              <div className="flex items-center justify-between gap-7 border-b px-5 pt-6 pb-5">
                <h1 className="text-4xl font-bold text-font-title">
                  <Link href="/">Seguimiento de Casos</Link>
                </h1>
                <div className="flex items-center">
                  <div className="mr-14 w-72">
                    <SelectInput
                      options={sections}
                      label={"Sección"}
                      value={selectedSection}
                      onChange={handleSectionSelect}
                    />
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button icon="FileIcon" className="">
                      Historial
                    </Button>
                    <Button icon="2cuadrados" filled />
                    <Button icon="chatbubble" filled />
                    <Button
                      icon="SaveIcon"
                      filled
                      type="button"
                      onClick={() =>
                        updateSeguimiento(
                          newMetastasisList,
                          newRecurrenciaList,
                          newProgresionList,
                          newTratamientoEnFALPList
                        )
                      }
                    />
                    <Link href="../../">
                      <Button icon="GeoLocate" filled>
                        Seguimientos
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <BoundingBox
                  thin
                  className="m-4 border-2 border-background-dark bg-background"
                >
                  <div className="flex place-items-center justify-around">
                    <div className="flex-col items-center justify-center">
                      <h2 className="text-2xl font-bold">
                        {caso?.nombre} {caso?.apellido}
                      </h2>
                      <Subtitle
                        label={"Seguimiento"}
                        value={
                          seguimientoQuery?.data?.numero_seguimiento?.toString() ||
                          ""
                        }
                      />
                    </div>
                    <StickyContent label={"RUT"} value={caso?.rut_dni || ""} />
                    <StickyContent
                      label={"Ficha"}
                      value={caso?.ficha.toString() || ""}
                    />
                    <StickyContent
                      label={"Subcategoría"}
                      value={caso?.subcategoria || ""}
                    />
                    <StickyContent
                      label={"Lateralidad"}
                      value={caso?.lateralidad || ""}
                    />
                    <Modal
                      className="w-48 place-self-center"
                      type="button"
                      morePatientInfo={true}
                      filled
                      seguimiento={seguimientoQuery.data}
                    >
                      Más Información
                    </Modal>
                  </div>
                </BoundingBox>
              </div>
            </div>

            <form
              className="mt-2 mb-3 flex flex-col gap-7"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Section id="metastasis" title="Metástasis">
                <SubSection>
                  <div className="flex justify-between">
                    <Checkbox
                      {...register("posee_metastasis")}
                      label="Presenta Metástasis"
                    />
                    <Modal
                      type="button"
                      disabled={!tieneMetastasis}
                      metastasis={true}
                      icon="plus"
                      filled
                      seguimiento={seguimientoQuery.data}
                      setNewMetastasisList={setNewMetastasisList}
                    >
                      Agregar Metastasis
                    </Modal>
                  </div>

                  <div className="mt-5">
                    <MetastasisList
                      elements={
                        caso?.metastasis
                          ? [...caso.metastasis, ...newMetastasisList]
                          : newMetastasisList
                      }
                    />
                  </div>
                </SubSection>
              </Section>
              <Section id="recurrencia" title="Recurrencia">
                <SubSection>
                  <div className="flex justify-between">
                    <Checkbox
                      {...register("posee_recurrencia")}
                      label="Presenta recurrencia"
                    />
                    <Modal
                      type="button"
                      disabled={!tieneRecurrencia}
                      recurrencia={true}
                      icon="plus"
                      seguimiento={seguimientoQuery.data}
                      filled
                      setNewRecurrenciaList={setNewRecurrenciaList}
                    >
                      Agregar Recurrencia
                    </Modal>
                  </div>
                </SubSection>
                <div className="mt-5">
                  <RecurrenciaList
                    elements={
                      caso?.recurrencias
                        ? [...caso.recurrencias, ...newRecurrenciaList]
                        : newRecurrenciaList
                    }
                  />
                </div>
              </Section>
              <Section id="progresion" title="Progresión">
                <SubSection>
                  <div className="flex justify-between">
                    <Checkbox
                      {...register("posee_progresion")}
                      label="Presenta progresión"
                    />
                    <Modal
                      type="button"
                      disabled={!tieneProgresion}
                      progresion={true}
                      icon="plus"
                      seguimiento={seguimientoQuery.data}
                      filled
                      setNewProgresionList={setNewProgresionList}
                    >
                      Agregar Progresión
                    </Modal>
                  </div>
                </SubSection>
                <div className="mt-5">
                  <ProgresionList
                    elements={
                      caso?.progresiones
                        ? [...caso.progresiones, ...newProgresionList]
                        : newProgresionList
                    }
                  />
                </div>
              </Section>
              <Section id="tratamiento" title="Antecedentes Tratamiento">
                <SubSection title="">
                  <div className="grid max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-3">
                    <div>
                      <SelectInput
                        label={"Agregar Tratamiento"}
                        options={[
                          { id: 1, name: "Tratamiento En FALP" },
                          { id: 2, name: "Tratamiento Post/Durante FALP" },
                        ]}
                      />
                    </div>
                    <Modal
                      type="button"
                      className="max-w-[115px]"
                      tratamiento={true}
                      icon="plus"
                      seguimiento={seguimientoQuery.data}
                      filled
                      setNewTratamientoList={setNewTratamientoEnFALPList}
                    >
                      Agregar
                    </Modal>
                  </div>
                  <div className="mt-5">
                    <TratamientoList
                      elements={
                        caso?.tratamientos_en_falp
                          ? [
                              ...caso.tratamientos_en_falp,
                              ...newTratamientoEnFALPList,
                            ]
                          : newTratamientoEnFALPList
                      }
                    />
                  </div>
                </SubSection>
              </Section>
              <Section id="validacion" title="Validación Antecedentes">
                <SubSection title="Validación Clase de Caso"></SubSection>
                <div className="grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
                  <Controller
                    name="validacion_clase_caso"
                    control={control}
                    defaultValue={seguimientoQuery.data.validacion_clase_caso!}
                    render={({ field }) => (
                      <div className="col-span-2">
                        <SelectInput
                          label={"Clase Caso"}
                          options={[
                            ClaseCaso.diagnostico_y_tratamiento_en_falp,
                            ClaseCaso.tratamiento_en_falp,
                            ClaseCaso.diagnostico_en_falp,
                          ]}
                          {...field}
                        />
                      </div>
                    )}
                  />
                </div>
                <Separator />
                <SubSection title="Último Contacto"></SubSection>
                <div className="grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
                  <div>
                    <Controller
                      name="ultimo_contacto"
                      control={control}
                      defaultValue={seguimientoQuery.data.ultimo_contacto!}
                      render={({ field }) => (
                        <DatePicker
                          defaultValue={
                            seguimientoQuery.data?.ultimo_contacto
                              ? new Date(seguimientoQuery.data?.ultimo_contacto)
                              : new Date()
                          }
                          label="Último Contacto"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center">
                    {/* TODO: Este campo no existe en el modelo */}
                    <Checkbox
                      {...register(
                        "caso_registro_correspondiente.sigue_atencion_otro_centro"
                      )}
                      label="Seguimiento otro centro"
                    />
                  </div>
                </div>
                <Separator />
                <SubSection title="Estado Vital"></SubSection>
                <div className="grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
                  <Controller
                    name="condicion_del_caso"
                    control={control}
                    defaultValue={seguimientoQuery.data?.condicion_del_caso}
                    render={({ field }) => (
                      <SelectInput
                        label="Condición del Caso"
                        options={[
                          CondicionCaso.vivo_sin_enfermedad,
                          CondicionCaso.vivo_con_enfermedad,
                          CondicionCaso.vivo_soe,
                          CondicionCaso.desconocido,
                          CondicionCaso.fallecido,
                        ]}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="estado_vital"
                    control={control}
                    defaultValue={seguimientoQuery.data?.estado_vital}
                    render={({ field }) => (
                      <SelectInput
                        label="Estado Vital"
                        options={["Vivo", "Muerto"]}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="causa_defuncion"
                    control={control}
                    defaultValue={seguimientoQuery.data?.causa_defuncion}
                    render={({ field }) => (
                      <div className="col-start-1">
                        <SelectInput
                          disabled={
                            seguimientoQuery.data?.estado_vital === "Vivo" &&
                            estadoVital !== "Muerto"
                          }
                          label="Causa Defunción"
                          options={[
                            "Muerte por cáncer o complicación",
                            "Muerte por otra causa",
                            "Desconocido",
                          ]}
                          {...field}
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="fecha_defuncion"
                    control={control}
                    defaultValue={seguimientoQuery.data?.fecha_defuncion}
                    render={({ field }) => (
                      <DatePicker
                        label="Fecha Defunción"
                        disabled={
                          seguimientoQuery.data?.estado_vital === "Vivo" &&
                          estadoVital !== "Muerto"
                        }
                        defaultValue={
                          caso?.fecha_defuncion
                            ? new Date(caso.fecha_defuncion)
                            : new Date()
                        }
                        {...field}
                      />
                    )}
                  />
                  <div className="flex items-center">
                    {/* TODO: Agregar fecha estimada en modelo de datos, actualmente no existe */}
                    <Checkbox
                      disabled={
                        seguimientoQuery.data?.estado_vital === "Vivo" &&
                        estadoVital !== "Muerto"
                      }
                      label="Estimada"
                    />
                  </div>
                </div>
              </Section>
              <div className="flex justify-around">
                <Modal
                  type="button"
                  sign={true}
                  seguimiento={seguimientoQuery.data}
                  filled
                >
                  Firmar Seguimiento
                </Modal>
              </div>
            </form>
          </>
        )}
        <div className="h-screen" />
      </MainLayout>
    </FormProvider>
  );
}

function StickyContent(props: { label: string; value: string }) {
  const { label, value } = props;
  return (
    <div className="flex gap-1">
      <div className="font-bold">{label}: </div>{" "}
      <div className="font-bold">{value}</div>
    </div>
  );
}

function Subtitle(props: { label: string; value: string }) {
  const { label, value } = props;
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="font-subtitle">{label} </div>{" "}
      <div className="font-subtitle">{value}</div>
    </div>
  );
}

function SubSection(props: { title?: string } & React.PropsWithChildren) {
  return (
    <>
      <h3 className="mt-5 mb-8 text-xl font-bold text-font-title">
        {props.title}
      </h3>
      {props.children}
    </>
  );
}

function Separator() {
  return <div className="mt-6 h-[1px] w-full bg-zinc-400"></div>;
}
