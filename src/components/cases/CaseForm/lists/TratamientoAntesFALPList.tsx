import Datagrid from "@/components/ui/table/Datagrid";
import DateCell from "@/components/ui/table/DateCell";
import { EntryType } from "@/types/Enums";
import {
  TratamientoAntesFALP,
  TratamientoAntesFALPCreate,
} from "@/types/TratamientoAntesFALP";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useContext, useMemo } from "react";
import { SeguimientoContext } from "../context/seguimiento";
import { UpdateDataContext } from "../context/updateData";
import useSeguimientoEntries from "../hooks/useSeguimientoEntries";

const columnHelper = createColumnHelper<TratamientoAntesFALP>();
export default function TratamientoPostList() {
  const updateData = useContext(UpdateDataContext);
  const seguimiento = useContext(SeguimientoContext);
  const data = useSeguimientoEntries<TratamientoAntesFALP>(
    seguimiento,
    updateData,
    EntryType.tratamiento_antes_falp
  );
  console.log("TratamientoAntesFalpList data: ", data);

  const columns = useMemo(
    () => [
      columnHelper.accessor("fecha_de_inicio", {
        header: "Inicio",
        cell: DateCell,
        size: 50,
      }),
      columnHelper.accessor("lugar_tto", {
        header: "Lugar Tratamiento",
        size: 70,
      }),
      columnHelper.accessor("categoria_tto", {
        header: "Categoría",
        size: 60,
      }),
      columnHelper.accessor("subcategoria_tto", {
        header: "Subcategoría",
        size: 70,
      }),
      columnHelper.accessor("intencion_tto", {
        header: "Intención",
        size: 70,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: "updated_at",
          desc: true,
        },
      ],
      pagination: {
        pageSize: 5,
      },
    },
  });
  return (
    <div>
      <Datagrid
        table={table}
        title="Lista de Tratamientos Antes FALP"
        total={{
          value: data.length,
          name: "Tratamiento",
          pluralName: "Tratamientos",
        }}
      />
    </div>
  );
}
