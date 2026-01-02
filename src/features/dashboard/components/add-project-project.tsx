"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { PlusCircle, SquareKanban, X, Loader2, Pencil } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageFallback from "@/components/shared/image-fallback";
import {
  useCreateProject,
  useUpdateProject,
  Project,
} from "@/features/projects";
import { useCamps } from "@/features/camps";
import { useProfile } from "@/features/profile";
import { toast } from "sonner";

// Schema matching the API requirements
const createProjectFormSchema = (t: any) =>
  z.object({
    name: z.string().min(1, t("validation.name_required")),
    type: z.string().min(1, t("validation.type_required")),
    beneficiary_count: z
      .string()
      .min(1, t("validation.beneficiary_count_required")),
    college: z.string().optional(),
    notes: z.string().optional(),
    camp_id: z.string().optional(),
  });

interface ProjectFormDialogProps {
  project?: Project;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function ProjectFormDialog({
  project,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: ProjectFormDialogProps) {
  const t = useTranslations("projects");
  const [file, setFile] = useState<File | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { data: campsData } = useCamps();
  const { data: profileData } = useProfile();
  const camps = campsData?.data || [];

  // Get user's camp from profile
  const userCamp = profileData?.data?.camp;
  const isDelegate = profileData?.data?.role === "delegate";

  const isEdit = !!project;
  const projectFormSchema = createProjectFormSchema(t);

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      type: "",
      beneficiary_count: "",
      college: "",
      notes: "",
      camp_id: "",
    },
  });

  // Auto-set campId for delegates when profile loads
  useEffect(() => {
    if (isDelegate && userCamp?.id) {
      form.setValue("camp_id", userCamp.id.toString());
    }
  }, [userCamp, isDelegate, form]);

  // Reset form when project changes or dialog opens
  useEffect(() => {
    if (open) {
      if (project) {
        // Find camp ID by name
        const camp = camps.find((c) => c.name === project.camp);

        form.reset({
          name: project.name,
          type: project.type,
          beneficiary_count: project.beneficiaryCount.toString(),
          college: project.college,
          notes: project.notes || "",
          camp_id: camp ? camp.id.toString() : "",
        });
        setFile(null);
      } else {
        // Reset to empty for new project - delegates will have camp_id set by the other useEffect
        form.reset({
          name: "",
          type: "",
          beneficiary_count: "",
          college: "",
          notes: "",
          camp_id: isDelegate && userCamp?.id ? userCamp.id.toString() : "",
        });
        setFile(null);
      }
    }
  }, [open, project, camps, form, isDelegate, userCamp]);

  const onSubmit = (values: z.infer<typeof projectFormSchema>) => {
    // Debug logging
    console.log("[DEBUG] onSubmit - isDelegate:", isDelegate);
    console.log("[DEBUG] onSubmit - userCamp:", userCamp);
    console.log("[DEBUG] onSubmit - profileData:", profileData?.data);
    console.log("[DEBUG] onSubmit - values.camp_id:", values.camp_id);

    // For delegates, use their assigned camp; for admins, use the selected camp
    // Also use form's camp_id as fallback
    const campId =
      isDelegate && userCamp?.id
        ? userCamp.id.toString()
        : values.camp_id || form.getValues("camp_id");

    if (!campId) {
      console.error("Camp ID is required - userCamp:", userCamp);
      toast.error("لا يمكن إنشاء المشروع", {
        description: "لم يتم تحديد الإيواء. تأكد من أنك مسجل في إيواء معين.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("type", values.type);
    formData.append("beneficiary_count", values.beneficiary_count);
    formData.append("college", values.beneficiary_count);
    formData.append("camp_id", campId);
    if (values.notes) {
      formData.append("notes", values.notes);
    }
    if (file) {
      formData.append("project_image", file);
    }

    if (isEdit && project) {
      updateProject.mutate(
        { id: project.id, data: formData },
        {
          onSuccess: () => {
            setOpen(false);
            setFile(null);
          },
        }
      );
    } else {
      createProject.mutate(formData, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          setFile(null);
        },
      });
    }
  };

  const isLoading = createProject.isPending || updateProject.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="bg-[#1F423B] text-white px-6 py-5! rounded-xl flex items-center gap-2">
            {t("add_project")} <PlusCircle className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="rounded-xl max-w-3xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <DialogTitle className="font-bold text-[#1E1E1E] text-lg flex items-center gap-2">
            <SquareKanban className="text-primary" />
            {isEdit ? t("edit_project") : t("add_project")}
          </DialogTitle>
        </div>

        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto bg-[#f4f4f4] rounded-xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) =>
                console.error("Form validation errors:", errors)
              )}
              className="space-y-6"
            >
              {/* TOP GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl">
                {/* اسم المشروع */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="bg-white">
                        <Input placeholder={t("project_name")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* النوع */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="bg-white">
                        <Input placeholder={t("type")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* عدد المستفيدين */}
                <FormField
                  control={form.control}
                  name="beneficiary_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="bg-white">
                        <Input
                          type="number"
                          placeholder={t("beneficiary_count")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* المخيم - Show for admins, or for delegates without an assigned camp */}
                {(!isDelegate || !userCamp?.id) && (
                  <FormField
                    control={form.control}
                    name="camp_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full bg-white">
                              {field.value
                                ? camps.find(
                                    (c) => c.id.toString() === field.value
                                  )?.name || t("select_camp")
                                : t("select_camp")}
                            </SelectTrigger>
                            <SelectContent>
                              {camps.map((camp) => (
                                <SelectItem
                                  key={camp.id}
                                  value={camp.id.toString()}
                                >
                                  {camp.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* FILE UPLOAD */}
              <div className="bg-[#F4F4F4] p-4 rounded-xl flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-6 justify-between">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 w-full">
                  {/* Hidden image input */}
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected) setFile(selected);
                    }}
                  />

                  {/* Upload Box */}
                  <div
                    className="flex items-center rounded-xl ps-2 bg-white border overflow-hidden h-11 w-full sm:w-auto cursor-pointer"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    <div className="flex items-center gap-1">
                      <ImageFallback
                        src={
                          file
                            ? URL.createObjectURL(file)
                            : isEdit && project?.projectImage
                            ? project.projectImage
                            : "/image-icon.png"
                        }
                        width={24}
                        height={24}
                        className="size-6 transition-all object-cover"
                      />
                      <span className="text-xs text-gray-600 px-4 whitespace-nowrap">
                        {isEdit ? t("change_image") : t("add_image")}
                      </span>
                    </div>

                    <div className="w-px h-full bg-gray-200" />

                    <Button
                      variant="ghost"
                      type="button"
                      className="h-full px-6 rounded-none text-gray-700 bg-[#f7f7f7] font-medium"
                    >
                      {t("upload")}
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {file && (
                    <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-2 shadow-sm">
                      <span className="text-xs text-gray-700 max-w-[120px] truncate">
                        {file.name}
                      </span>

                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setFile(null)}
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* NOTE */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="bg-white">
                      <Textarea placeholder={t("notes")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* SUBMIT */}
              <div className="flex justify-center gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-white min-w-[160px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      {isEdit ? t("updating") : t("adding")}
                    </>
                  ) : isEdit ? (
                    t("update_btn")
                  ) : (
                    t("add_btn")
                  )}
                </Button>

                <DialogClose asChild>
                  <Button
                    type="button"
                    className="bg-secondary text-black min-w-[160px]"
                  >
                    {t("cancel")}
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
