"use client";

import { Filter, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Checkbox,
  Input,
  Label,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slider,
} from "@/components/ui";
import { useDebounce } from "@/hooks/common";
import {
  FilterOptionWithCount,
  ProductFiltersResponse,
} from "@/models/responses";

export interface AdvancedFiltersState {
  categories: string[];
  brands: string[];
  statuses: string[];
  minPrice: number | undefined;
  maxPrice: number | undefined;
}

interface AdvancedFiltersProps {
  filtersData: ProductFiltersResponse | undefined;
  isLoading: boolean;
  currentFilters: AdvancedFiltersState;
  onFiltersChange: (filters: AdvancedFiltersState) => void;
}

export const AdvancedFilters = ({
  filtersData,
  isLoading,
  currentFilters,
  onFiltersChange,
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] =
    useState<AdvancedFiltersState>(currentFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentFilters.minPrice ?? filtersData?.minPrice ?? 0,
    currentFilters.maxPrice ?? filtersData?.maxPrice ?? 1000000,
  ]);
  const [minPriceInput, setMinPriceInput] = useState(
    currentFilters.minPrice?.toString() ?? ""
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    currentFilters.maxPrice?.toString() ?? ""
  );
  const [isInputChanging, setIsInputChanging] = useState(false);

  // Ref para rastrear si estamos arrastrando (no causa re-renders)
  const isDraggingRef = useRef(false);

  const debouncedPriceRange = useDebounce(priceRange, 500);

  // Solo sincronizar cuando no estamos arrastrando el slider ni editando inputs
  useEffect(() => {
    if (!isDraggingRef.current && !isInputChanging) {
      setLocalFilters(currentFilters);
      setPriceRange([
        currentFilters.minPrice ?? filtersData?.minPrice ?? 0,
        currentFilters.maxPrice ?? filtersData?.maxPrice ?? 1000000,
      ]);
      setMinPriceInput(currentFilters.minPrice?.toString() ?? "");
      setMaxPriceInput(currentFilters.maxPrice?.toString() ?? "");
    }
  }, [
    currentFilters,
    filtersData?.minPrice,
    filtersData?.maxPrice,
    isInputChanging,
  ]);

  // Aplicar cambios de precio desde inputs cuando el debounce termina
  useEffect(() => {
    if (!isInputChanging) return;

    const minPrice = filtersData?.minPrice ?? 0;
    const maxPrice = filtersData?.maxPrice ?? 1000000;

    const newMinPrice =
      debouncedPriceRange[0] === minPrice ? undefined : debouncedPriceRange[0];
    const newMaxPrice =
      debouncedPriceRange[1] === maxPrice ? undefined : debouncedPriceRange[1];

    const newFilters = {
      ...localFilters,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    setIsInputChanging(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPriceRange]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentFilters.categories.length > 0)
      count += currentFilters.categories.length;
    if (currentFilters.brands.length > 0) count += currentFilters.brands.length;
    if (currentFilters.statuses.length > 0)
      count += currentFilters.statuses.length;
    if (
      currentFilters.minPrice !== undefined ||
      currentFilters.maxPrice !== undefined
    )
      count += 1;
    return count;
  }, [currentFilters]);

  const handleCategoryToggle = useCallback(
    (category: string) => {
      const newCategories = localFilters.categories.includes(category)
        ? localFilters.categories.filter(c => c !== category)
        : [...localFilters.categories, category];

      const newFilters = { ...localFilters, categories: newCategories };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [localFilters, onFiltersChange]
  );

  const handleBrandToggle = useCallback(
    (brand: string) => {
      const newBrands = localFilters.brands.includes(brand)
        ? localFilters.brands.filter(b => b !== brand)
        : [...localFilters.brands, brand];

      const newFilters = { ...localFilters, brands: newBrands };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [localFilters, onFiltersChange]
  );

  const handleStatusToggle = useCallback(
    (status: string) => {
      const newStatuses = localFilters.statuses.includes(status)
        ? localFilters.statuses.filter(s => s !== status)
        : [...localFilters.statuses, status];

      const newFilters = { ...localFilters, statuses: newStatuses };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [localFilters, onFiltersChange]
  );

  // Solo actualiza visualmente el slider mientras se arrastra (usando ref para no causar re-renders)
  const handleSliderChange = useCallback((values: number[]) => {
    isDraggingRef.current = true;
    setPriceRange([values[0], values[1]]);
    setMinPriceInput(values[0].toString());
    setMaxPriceInput(values[1].toString());
  }, []);

  // Aplica los filtros cuando el usuario suelta el slider
  const handleSliderCommit = useCallback(
    (values: number[]) => {
      const minPrice = filtersData?.minPrice ?? 0;
      const maxPrice = filtersData?.maxPrice ?? 1000000;

      const newMinPrice = values[0] === minPrice ? undefined : values[0];
      const newMaxPrice = values[1] === maxPrice ? undefined : values[1];

      const newFilters = {
        ...localFilters,
        minPrice: newMinPrice,
        maxPrice: newMaxPrice,
      };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
      isDraggingRef.current = false;
    },
    [
      filtersData?.minPrice,
      filtersData?.maxPrice,
      localFilters,
      onFiltersChange,
    ]
  );

  const handleMinPriceChange = useCallback(
    (value: string) => {
      setMinPriceInput(value);
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setIsInputChanging(true);
        const minPrice = filtersData?.minPrice ?? 0;
        const clampedValue = Math.max(
          minPrice,
          Math.min(numValue, priceRange[1])
        );
        setPriceRange([clampedValue, priceRange[1]]);
      }
    },
    [filtersData?.minPrice, priceRange]
  );

  const handleMaxPriceChange = useCallback(
    (value: string) => {
      setMaxPriceInput(value);
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setIsInputChanging(true);
        const maxPrice = filtersData?.maxPrice ?? 1000000;
        const clampedValue = Math.min(
          maxPrice,
          Math.max(numValue, priceRange[0])
        );
        setPriceRange([priceRange[0], clampedValue]);
      }
    },
    [filtersData?.maxPrice, priceRange]
  );

  const handleClearFilters = useCallback(() => {
    const clearedFilters: AdvancedFiltersState = {
      categories: [],
      brands: [],
      statuses: [],
      minPrice: undefined,
      maxPrice: undefined,
    };
    setLocalFilters(clearedFilters);
    setPriceRange([
      filtersData?.minPrice ?? 0,
      filtersData?.maxPrice ?? 1000000,
    ]);
    setMinPriceInput("");
    setMaxPriceInput("");
    onFiltersChange(clearedFilters);
  }, [filtersData?.minPrice, filtersData?.maxPrice, onFiltersChange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-4 overflow-y-auto h-full pb-4">
      {/* Header con contador de filtros activos */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <span className="font-semibold">Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <Separator />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={["categories", "price", "status", "brands"]}
          className="w-full"
        >
          {/* Filtro por Categoría */}
          <AccordionItem value="categories">
            <AccordionTrigger className="text-sm font-medium">
              Categorías
              {localFilters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {localFilters.categories.length}
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {filtersData?.categories.map(
                  (category: FilterOptionWithCount) => (
                    <FilterCheckboxItem
                      key={category.name}
                      label={category.name}
                      count={category.count}
                      checked={localFilters.categories.includes(category.name)}
                      onCheckedChange={() =>
                        handleCategoryToggle(category.name)
                      }
                    />
                  )
                )}
                {(!filtersData?.categories ||
                  filtersData.categories.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No hay categorías disponibles
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filtro por Rango de Precios */}
          <AccordionItem value="price">
            <AccordionTrigger className="text-sm font-medium">
              Rango de Precios
              {(currentFilters.minPrice !== undefined ||
                currentFilters.maxPrice !== undefined) && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  1
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {/* Slider de rango de precios */}
                <div className="px-2 py-2">
                  <Slider
                    value={priceRange}
                    min={filtersData?.minPrice ?? 0}
                    max={filtersData?.maxPrice ?? 1000000}
                    step={100}
                    onValueChange={handleSliderChange}
                    onValueCommit={handleSliderCommit}
                    className="w-full"
                  />
                </div>

                {/* Inputs de precio mínimo y máximo */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="minPrice"
                      className="text-xs text-muted-foreground"
                    >
                      Mínimo
                    </Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder={formatPrice(filtersData?.minPrice ?? 0)}
                      value={minPriceInput}
                      onChange={e => handleMinPriceChange(e.target.value)}
                      min={filtersData?.minPrice ?? 0}
                      max={priceRange[1]}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="maxPrice"
                      className="text-xs text-muted-foreground"
                    >
                      Máximo
                    </Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder={formatPrice(
                        filtersData?.maxPrice ?? 1000000
                      )}
                      value={maxPriceInput}
                      onChange={e => handleMaxPriceChange(e.target.value)}
                      min={priceRange[0]}
                      max={filtersData?.maxPrice ?? 1000000}
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Texto mostrando el rango seleccionado */}
                <p className="text-xs text-center text-muted-foreground">
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filtro por Estado del Producto */}
          <AccordionItem value="status">
            <AccordionTrigger className="text-sm font-medium">
              Estado del Producto
              {localFilters.statuses.length > 0 && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {localFilters.statuses.length}
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {filtersData?.statuses.map((status: FilterOptionWithCount) => (
                  <FilterCheckboxItem
                    key={status.name}
                    label={status.name}
                    count={status.count}
                    checked={localFilters.statuses.includes(status.name)}
                    onCheckedChange={() => handleStatusToggle(status.name)}
                  />
                ))}
                {(!filtersData?.statuses ||
                  filtersData.statuses.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No hay estados disponibles
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filtro por Marca */}
          <AccordionItem value="brands">
            <AccordionTrigger className="text-sm font-medium">
              Marcas
              {localFilters.brands.length > 0 && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {localFilters.brands.length}
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {filtersData?.brands.map((brand: FilterOptionWithCount) => (
                  <FilterCheckboxItem
                    key={brand.name}
                    label={brand.name}
                    count={brand.count}
                    checked={localFilters.brands.includes(brand.name)}
                    onCheckedChange={() => handleBrandToggle(brand.name)}
                  />
                ))}
                {(!filtersData?.brands || filtersData.brands.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No hay marcas disponibles
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );

  // Componente para versión móvil (Sheet)
  const MobileFilters = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[350px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Filtros Avanzados</SheetTitle>
          <SheetDescription>
            Refina tu búsqueda de productos usando los filtros disponibles.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <FilterContent />
        </div>
      </SheetContent>
    </Sheet>
  );

  // Componente para versión desktop (Sidebar)
  const DesktopFilters = () => (
    <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
      <div className="sticky top-24 bg-card border rounded-lg p-4 shadow-sm">
        <FilterContent />
      </div>
    </aside>
  );

  return (
    <>
      <MobileFilters />
      <DesktopFilters />
    </>
  );
};

// Componente auxiliar para los checkboxes con conteo
interface FilterCheckboxItemProps {
  label: string;
  count: number;
  checked: boolean;
  onCheckedChange: () => void;
}

const FilterCheckboxItem = ({
  label,
  count,
  checked,
  onCheckedChange,
}: FilterCheckboxItemProps) => (
  <div
    className="flex items-center justify-between hover:bg-muted/50 rounded-md p-1.5 -m-1.5 cursor-pointer group"
    onClick={onCheckedChange}
  >
    <div className="flex items-center gap-2">
      <Checkbox
        id={`filter-${label}`}
        checked={checked}
        onCheckedChange={onCheckedChange}
        onClick={e => e.stopPropagation()}
      />
      <Label
        htmlFor={`filter-${label}`}
        className="text-sm cursor-pointer group-hover:text-foreground"
      >
        {label}
      </Label>
    </div>
    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
      {count}
    </span>
  </div>
);

// Componente para mostrar los filtros activos como badges removibles
interface ActiveFiltersDisplayProps {
  filters: AdvancedFiltersState;
  onRemoveCategory: (category: string) => void;
  onRemoveBrand: (brand: string) => void;
  onRemoveStatus: (status: string) => void;
  onRemovePriceRange: () => void;
  onClearAll: () => void;
}

export const ActiveFiltersDisplay = ({
  filters,
  onRemoveCategory,
  onRemoveBrand,
  onRemoveStatus,
  onRemovePriceRange,
  onClearAll,
}: ActiveFiltersDisplayProps) => {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.statuses.length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  if (!hasActiveFilters) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-sm text-muted-foreground">Filtros activos:</span>

      {filters.categories.map(category => (
        <Badge
          key={`cat-${category}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {category}
          <button
            onClick={() => onRemoveCategory(category)}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.brands.map(brand => (
        <Badge
          key={`brand-${brand}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {brand}
          <button
            onClick={() => onRemoveBrand(brand)}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.statuses.map(status => (
        <Badge
          key={`status-${status}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {status}
          <button
            onClick={() => onRemoveStatus(status)}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
        <Badge variant="secondary" className="gap-1 pr-1">
          {filters.minPrice !== undefined
            ? formatPrice(filters.minPrice)
            : "Min"}{" "}
          -{" "}
          {filters.maxPrice !== undefined
            ? formatPrice(filters.maxPrice)
            : "Max"}
          <button
            onClick={onRemovePriceRange}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs h-6 text-muted-foreground hover:text-foreground"
      >
        Limpiar todos
      </Button>
    </div>
  );
};
