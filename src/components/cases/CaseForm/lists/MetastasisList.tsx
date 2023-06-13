import Datagrid from "@/components/ui/table/Datagrid";
import DateCell from "@/components/ui/table/DateCell";
import LastDateCell from "@/components/ui/table/LastDateCell";
import { EntryType } from "@/types/Enums";
import { Metastasis } from "@/types/Metastasis";
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
import { MetastasisModalRender } from "../modals/MetastasisModal";
import { createEditColumn } from "./edition";

interface MetastasisListProps {
  origenFilter: number | null;
}

const columnHelper = createColumnHelper<Metastasis>();
const columns = [
  columnHelper.accessor("updated_at", {
    header: "Fecha Última Modificación",
    size: 110,
    cell: LastDateCell,
  }),
  columnHelper.accessor("fecha_diagnostico", {
    header: "Fecha Diagnóstico",
    cell: DateCell,
    size: 110,
  }),
  columnHelper.accessor("numero_seguimiento", {
    header: "Origen",
    size: 110,
    cell: ({ row }) => {
      if (
        row.original.numero_seguimiento === null ||
        row.original.numero_seguimiento === undefined
      ) {
        return "Registro";
      } else {
        return `Seguimiento ${row.original.numero_seguimiento}`;
      }
    },
  }),
  columnHelper.accessor("detalle_topografia", {
    header: "Detalle Topografia",
    size: 110,
  }),
  createEditColumn(
    columnHelper,
    "Metástasis",
    EntryType.metastasis,
    MetastasisModalRender
  ),
];

export default function MetastasisList({ origenFilter }: MetastasisListProps) {
  const seguimiento = useContext(SeguimientoContext);
  const updateData = useContext(UpdateDataContext);
  const allData = useSeguimientoEntries<Metastasis>(
    seguimiento,
    updateData,
    EntryType.metastasis
  );

  const data = useMemo(() => {
    return typeof origenFilter === "undefined"
      ? allData
      : allData.filter((row) => row.numero_seguimiento === origenFilter);
  }, [allData, origenFilter]);

  console.log("MetastasisList elements:", data);
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
        title="Lista Metástasis"
        total={{
          value: data.length,
          name: "Metástasis",
          pluralName: "Metástasis",
        }}
      />
    </div>
  );
}
