// Components
import Button from '../../shared/components/Button';

function QuantitySelector({ value, min = 1, max = 99, onChange }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center relative gap-2">
      <Button
        type="button"
        onClick={dec}
        disabled={value <= min} //si la cantidad q se quiere es menor a 1
        className="px-2 py-1 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ➖
      </Button>

      <span className="w-8 text-center text-lg font-semibold">{value}</span>

      <Button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className="px-2 py-1 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ➕
      </Button>
    </div>
  );
}

export default function ProductCard({
  product,
  quantity,
  inCartQty = 0,
  onChangeQty,
  onAdd,
  imageSrc,
}) {
  const { name, stockQuantity, currentUnitPrice } = product || {};
  const isMaxReached = quantity + inCartQty > stockQuantity;
  const formatPrice = (value) => Number(value || 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  return (
    <div className="flex flex-col h-full">
      <img
        src={imageSrc}
        alt={name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Stock: {stockQuantity} • {formatPrice(currentUnitPrice)}
        </p>

        {inCartQty > 0 && (
          <p className="text-sm mt-1 text-green-600 font-medium">
            Ya tienes {inCartQty} en el carrito.
          </p>
        )}

          {isMaxReached && (
            <span className="text-sm text-red-600 font-medium">No hay suficiente stock</span>
          )}

        <div className="flex items-center gap-4 mt-auto pt-3">
          <QuantitySelector
            value={quantity}
            min={1}
            max={stockQuantity-inCartQty} //para que cuente con lo que ya esta en el carrito
            onChange={onChangeQty}
          />

          <Button
            onClick={onAdd}
            disabled={isMaxReached}
            className="ml-auto text-sm px-4 py-2 sm:text-base disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
