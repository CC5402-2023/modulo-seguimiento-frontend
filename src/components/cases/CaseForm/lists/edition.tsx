import Button from "@/components/ui/Button";
import Modal, { ModalProps, ModalRenderProps } from "@/components/ui/Modal";
import { useMutationUpdateSeguimiento } from "@/hooks/seguimiento";
import { CellContext, ColumnHelper } from "@tanstack/react-table";
import React, { useContext } from "react";
import { SeguimientoContext } from "../context/seguimiento";
import { serializeSeguimientoUpdate } from "../serialization/serialization";
import { useFormContext } from "react-hook-form";
import { Seguimiento, SeguimientoUpdate } from "@/types/Seguimiento";
import { SeguimientoForm } from "../../CaseForm";
import { EntryType } from "@/types/Enums";

export interface EditModalRenderProps<T = Record<string, any>>
  extends ModalRenderProps {
  edit?: boolean;
  data?: T;
}

export function createEditColumn<T extends { id: any }>(
  colHelper: ColumnHelper<T>,
  name: string,
  entryType: EntryType,
  editModalRender: React.ComponentType<EditModalRenderProps<T>>
) {
  return colHelper.display({
    id: "_edit_buttons",
    size: 20,
    cell: (props) => (
      <EditColumnCell
        cellContext={props}
        editModalRender={editModalRender}
        name={name}
        entryType={entryType}
      />
    ),
  });
}

function EditColumnCell<T extends { id: any }>(props: {
  cellContext: CellContext<T, unknown>;
  name: string;
  entryType: EntryType;
  editModalRender: React.ComponentType<EditModalRenderProps<T>>;
}) {
  const seguimiento = useContext(SeguimientoContext);
  const updateMutation = useMutationUpdateSeguimiento(seguimiento?.id);
  const form = useFormContext<SeguimientoForm>();
  const EditModalRender = props.editModalRender;
  if (!seguimiento) return <></>;
  return (
    <div className="flex gap-6">
      <Modal
        title={`Editar ${name}`}
        clear
        filled={false}
        render={(renderProps) => (
          <EditModalRender
            edit={true}
            data={props.cellContext.cell.row.original}
            {...renderProps}
          />
        )}
      >
        Editar
      </Modal>
      <Button
        clear
        type="button"
        filled={false}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const payload: SeguimientoUpdate = {
            ...serializeSeguimientoUpdate(form.getValues(), seguimiento),
            deleted_entries: [
              {
                entry_type: props.entryType,
                entry_id: props.cellContext.row.original.id,
              },
            ],
          };
          updateMutation.mutate(payload);
        }}
        loading={updateMutation.isLoading}
      >
        Borrar
      </Button>
    </div>
  );
}
