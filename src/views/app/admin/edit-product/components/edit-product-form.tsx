"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { ProductDetailForAdminResponse } from "@/models/responses";

import { useEditProduct } from "../hooks";
import { ImageInput } from "./image-input";

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres" })
    .max(50, { message: "El título debe tener como máximo 50 caracteres" }),
  description: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(500, {
      message: "La descripción debe tener como máximo 500 caracteres",
    }),
  price: z.coerce
    .number()
    .int({ message: "El precio debe ser un número entero" })
    .gte(0, { message: "El precio no puede ser menor a 0" }),
  stock: z.coerce
    .number()
    .int({ message: "El stock debe ser un número entero" })
    .gte(0, { message: "El stock no puede ser menor a 0" }),
  discount: z.coerce
    .number()
    .int({ message: "El descuento debe ser un número entero" })
    .gte(0, { message: "El descuento no puede ser menor a 0" })
    .lte(100, { message: "El descuento no puede superar el 100%" }),
  status: z.enum(["Nuevo", "Usado"], {
    message: "Seleccione un estado válido",
  }),
  categoryName: z
    .string()
    .min(3, { message: "La categoría debe tener al menos 3 caracteres" })
    .max(50, { message: "La categoría debe tener como máximo 50 caracteres" }),
  brandName: z
    .string()
    .min(3, { message: "La marca debe tener al menos 3 caracteres" })
    .max(50, { message: "La marca debe tener como máximo 50 caracteres" }),
  images: z
    .array(z.instanceof(File))
    .optional()
    .refine(files => !files || files.every(file => file.size <= 5_242_880), {
      message: "Una o más imágenes superan el peso máximo de 5 MB",
    })
    .refine(
      files =>
        !files ||
        files.every(file =>
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          )
        ),
      { message: "Solo se admiten imágenes JPG, JPEG, PNG y WEBP" }
    ),
});

interface EditProductFormProps {
  productId: string;
  productData: ProductDetailForAdminResponse;
}

export function EditProductForm({
  productId,
  productData,
}: EditProductFormProps) {
  const {
    isLoading,
    actions: { handleUpdateProduct },
  } = useEditProduct();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: productData.title || "",
      description: productData.description || "",
      price: productData.price || 0,
      stock: productData.stock || 0,
      discount: productData.discount || 0,
      status:
        productData.status === "Nuevo"
          ? ("Nuevo" as const)
          : ("Usado" as const),
      categoryName: productData.categoryName || "",
      brandName: productData.brandName || "",
      images: [] as File[],
    },
    mode: "onTouched",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleUpdateProduct(productId, values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre del producto"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del producto..."
                      rows={4}
                      maxLength={500}
                      disabled={isLoading}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => {
                const { value, ...rest } = field;
                return (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        value={value as number}
                        {...rest}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => {
                const { value, ...rest } = field;
                return (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        value={value as number}
                        {...rest}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => {
                const { value, ...rest } = field;
                return (
                  <FormItem>
                    <FormLabel>Descuento (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        max={100}
                        value={value as number}
                        {...rest}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Nuevo">Nuevo</SelectItem>
                      <SelectItem value="Usado">Usado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Electrónica"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Samsung"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imágenes (opcional - para reemplazar)</FormLabel>
              <FormControl>
                <ImageInput
                  value={field.value ?? []}
                  onChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                Solo sube imágenes si deseas reemplazar las actuales
              </p>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Actualizando..." : "Actualizar Producto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
