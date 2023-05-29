import Button from "@/components/ui/Button";
import CustomDialog from "@/components/ui/CustomDialog";
import { Usuario } from "@/types/Usuario";
import clsx from "clsx";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

export default function AssignmentModal(props: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  seguimientoIds: number[];
}) {
  const queryClient = useQueryClient();
  const usersQuery = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: () =>
      fetch("http://localhost:8000/usuario/").then((res) => res.json()),
  });
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const assignMutation = useMutation(
    (data: { userId: number; seguimientoIds: number[] }) => {
      return Promise.all(
        data.seguimientoIds.map((segId) =>
          fetch(
            `http://localhost:8000/seguimiento/assign/${segId}?usuario_id=${data.userId}`,
            {
              method: "PATCH",
            }
          )
        )
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["seguimientos"]);
        props.onSuccess();
        handleClose();
      },
    }
  );
  const handleClose = () => {
    setSelectedUserId(null);
    props.onClose();
  };
  return (
    <CustomDialog
      open={props.open}
      onClose={handleClose}
      title={"Selección de usuario"}
    >
      {/* User selection */}
      {usersQuery.isSuccess && (
        <div className="flex flex-col gap-1">
          {usersQuery.data?.map((user) => (
            <button
              className={clsx(
                "rounded-lg border p-1 text-left",
                selectedUserId === user.id
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-zinc-100 bg-white"
              )}
              key={user.id}
              onClick={() => {
                setSelectedUserId((prev) => {
                  if (prev === user.id) {
                    return null;
                  } else {
                    return user.id;
                  }
                });
              }}
            >
              <div className="flex items-center gap-1">
                <div
                  className={clsx(
                    "mx-2 h-3 w-3 rounded-full",
                    selectedUserId === user.id ? "bg-indigo-300" : "bg-zinc-200"
                  )}
                />
                <div className="flex flex-col">
                  <div className="text-base font-medium text-font">
                    {user.nombre}
                  </div>
                  <div className="-mt-[2px] text-xs font-normal text-font-subtitle">
                    {user.email}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Footer buttons */}
      <div className="mt-4 flex w-full flex-row-reverse">
        <Button
          filled
          disabled={selectedUserId === null || assignMutation.isLoading}
          loading={assignMutation.isLoading}
          onClick={() => {
            assignMutation.mutate({
              userId: selectedUserId as number,
              seguimientoIds: props.seguimientoIds,
            });
          }}
        >
          Confirmar
        </Button>
      </div>
    </CustomDialog>
  );
}
