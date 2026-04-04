import Product from '../models/product.model';

// Diese Funktion versucht, ein Order-Item
// mit einem echten Produkt + einer echten Variante aus der DB zu matchen.
//
// Sie prüft:
// 1. Gibt es ein Produkt mit passendem Namen?
// 2. Gibt es in diesem Produkt die passende Variante (Farbe + Größe)?
// 3. Reicht der Lagerbestand?
//
// Wichtig:
// Für den MVP machen wir erstmal ein einfaches Matching über den Produktnamen.
export const matchProductVariantAndCheckStock = async (item: {
  productName: string;
  quantity: number;
  color?: string;
  size?: string;
}) => {
  // Produktname vereinfachen:
  // trim() entfernt Leerzeichen am Anfang/Ende
  const normalizedProductName = item.productName.trim();

  // Passendes Produkt suchen.
  // Wir suchen erstmal einfach case-insensitive über den Namen.
  const product = await Product.findOne({
    name: { $regex: new RegExp(`^${normalizedProductName}$`, 'i') },
    isActive: true,
  });

  // Falls kein Produkt gefunden wird,
  // geben wir direkt ein klares Ergebnis zurück.
  if (!product) {
    return {
      matched: false,
      reason: 'Product not found',
      product: null,
      variant: null,
      requestedQuantity: item.quantity,
      availableStock: 0,
    };
  }

  // Innerhalb des Produkts die passende Variante suchen.
  // Farbe und Größe vergleichen wir ebenfalls case-insensitive.
  const matchedVariant = product.variants.find((variant) => {
    const colorMatches = item.color
      ? variant.color.toLowerCase() === item.color.toLowerCase()
      : true;

    const sizeMatches = item.size
      ? variant.size.toLowerCase() === item.size.toLowerCase()
      : true;

    return colorMatches && sizeMatches;
  });

  // Wenn Produkt existiert, aber keine passende Variante
  // gefunden wurde, geben wir das klar zurück.
  if (!matchedVariant) {
    return {
      matched: false,
      reason: 'Matching variant not found',
      product,
      variant: null,
      requestedQuantity: item.quantity,
      availableStock: 0,
    };
  }

  // Prüfen, ob genug Bestand da ist.
  const isEnoughStock = matchedVariant.stock >= item.quantity;

  return {
    matched: true,
    reason: isEnoughStock ? 'Product and variant matched' : 'Insufficient stock',
    product,
    variant: matchedVariant,
    requestedQuantity: item.quantity,
    availableStock: matchedVariant.stock,
    inStock: isEnoughStock,
    missingQuantity: isEnoughStock ? 0 : item.quantity - matchedVariant.stock,
  };
};