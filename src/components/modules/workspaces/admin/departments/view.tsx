"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  updateDepartment,
} from "@/api/admin.api";
import EmptyState from "@/components/common/empty-state";
import ListToolbar from "@/components/common/list-toolbar";
import TableSkeleton from "@/components/common/table-skeleton";
import UrlPagination from "@/components/common/url-pagination";
import ValidatedForm from "@/components/form/validated-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useListParams } from "@/hooks/list-params.hook";
import { getErrorMessage } from "@/lib/errors";
import { extractDataArray, extractPaginationMeta } from "@/lib/utils";
import type { Department } from "@/types";
import { departmentSchema } from "@/validation/dashboard.validation";

export default function AdminDepartmentsPage() {
  const listParams = useListParams();

  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["departments", listParams],
    queryFn: () => getAllDepartments(listParams),
  });

  const createMutation = useMutation({
    mutationFn: (payload: { code: string; name: string }) =>
      editingId
        ? updateDepartment(editingId, payload)
        : createDepartment(payload),
    onSuccess: () => {
      toast.add({
        title: editingId ? "Department Updated" : "Department Created",
        description: `Department "${name}" saved successfully`,
        type: "success",
      });
      setIsCreateOpen(false);
      setEditingId(null);
      setCode("");
      setName("");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (err: unknown) => {
      toast.add({
        title: "Save Failed",
        description: getErrorMessage(err) || "Failed to save department",
        type: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      toast.add({
        title: "Department Deleted",
        description: "Department removed from catalog",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (err: unknown) => {
      toast.add({
        title: "Deletion Failed",
        description:
          getErrorMessage(err) ||
          "Cannot delete department with active programs",
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;
    createMutation.mutate({ code: code.toUpperCase(), name });
  };

  const departments = extractDataArray<Department>(data);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Academic Departments
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure institutional faculties and academic divisions.
          </p>
        </div>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) {
              setEditingId(null);
              setCode("");
              setName("");
            }
          }}
        >
          <DialogTrigger
            render={
              <Button
                size="sm"
                className="gap-2 shadow-xs"
                onClick={() => {
                  setEditingId(null);
                  setCode("");
                  setName("");
                }}
              >
                <Plus className="size-4" />
                <span>Add Department</span>
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Department" : "Add Academic Department"}
              </DialogTitle>
            </DialogHeader>
            <ValidatedForm
              values={{ code, name }}
              schema={departmentSchema}
              onSubmit={handleSubmit}
              className="space-y-3.5 mt-2"
            >
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Department Code *
                </label>
                <Input
                  required
                  placeholder="e.g. CSE, EEE, BBA"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Department Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Computer Science & Engineering"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Department"}
                </Button>
              </div>
            </ValidatedForm>
          </DialogContent>
        </Dialog>
      </div>

      <ListToolbar />
      {isLoading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load departments:{" "}
          {getErrorMessage(error) || "Unknown error"}
        </div>
      ) : departments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No departments found"
          description="Create your first academic department to begin offering programs."
          action={
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              Create Department
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Department Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {departments.map((dept: Department) => (
                  <tr
                    key={dept.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-foreground">
                      {dept.code}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {dept.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          dept.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {dept.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Edit ${dept.code}`}
                        onClick={() => {
                          setEditingId(dept.id);
                          setCode(dept.code);
                          setName(dept.name);
                          setIsCreateOpen(true);
                        }}
                        className="size-9 p-0"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Delete department ${dept.code}?`)) {
                            deleteMutation.mutate(dept.id);
                          }
                        }}
                        aria-label={`Delete ${dept.code}`}
                        disabled={deleteMutation.isPending}
                        className="text-destructive hover:bg-destructive/10 size-9 p-0"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!isLoading && !isError && (
        <UrlPagination
          currentPage={listParams.page}
          totalPages={extractPaginationMeta(data).totalPages}
          totalItems={extractPaginationMeta(data).total}
        />
      )}
    </div>
  );
}
