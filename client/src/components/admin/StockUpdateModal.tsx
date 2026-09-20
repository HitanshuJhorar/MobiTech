import { useState, FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { Button } from '../ui/Button';
import { Loader2, X, Plus, Minus } from 'lucide-react';
import { useInventoryMutations } from '../../hooks/useInventory';
import { InventoryProduct } from '../../services/inventoryService';

interface StockUpdateModalProps {
  product: InventoryProduct;
  onClose: () => void;
}

export function StockUpdateModal({ product, onClose }: StockUpdateModalProps) {
  const [mode, setMode] = useState<'set' | 'adjust'>('set');
  const [exactValue, setExactValue] = useState<string>(String(product.stockQuantity));
  const [adjustValue, setAdjustValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  const { setStock, isSettingStock, adjustStock, isAdjustingStock } = useInventoryMutations();
  const isBusy = isSettingStock || isAdjustingStock;

  const previewQty =
    mode === 'set'
      ? Number(exactValue)
      : product.stockQuantity + (Number(adjustValue) || 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (mode === 'set') {
        const qty = parseInt(exactValue, 10);
        if (isNaN(qty) || qty < 0 || qty > 100_000) {
          setErrorMsg('Enter a valid quantity between 0 and 100,000.');
          return;
        }
        await setStock({ productId: product._id, stockQuantity: qty });
      } else {
        const delta = parseInt(adjustValue, 10);
        if (isNaN(delta) || delta === 0) {
          setErrorMsg('Enter a non-zero integer adjustment.');
          return;
        }
        if (delta < -10_000 || delta > 10_000) {
          setErrorMsg('Adjustment must be between -10,000 and +10,000.');
          return;
        }
        if (product.stockQuantity + delta < 0) {
          setErrorMsg(`Cannot reduce below zero. Current stock is ${product.stockQuantity}.`);
          return;
        }
        await adjustStock({ productId: product._id, quantity: delta });
      }
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message || 'Stock update failed.';
        setErrorMsg(msg === 'INSUFFICIENT_STOCK' ? 'Insufficient stock for this adjustment.' : msg);
      } else {
        setErrorMsg('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary-dark/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-light-neutral animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-light-neutral">
          <div className="min-w-0">
            <h3 className="font-bold text-primary-dark truncate">Update Stock</h3>
            <p className="text-sm text-primary-dark/60 truncate">{product.name}</p>
          </div>
          <button onClick={onClose} className="ml-4 p-1 rounded-lg hover:bg-light-neutral/50 text-primary-dark/60 flex-shrink-0" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Current stock banner */}
        <div className="px-6 py-3 bg-soft-ivory/60 border-b border-light-neutral flex items-center gap-2">
          <span className="text-sm text-primary-dark/60">Current stock:</span>
          <span className="text-lg font-bold text-primary-dark">{product.stockQuantity}</span>
          <span className="text-sm text-primary-dark/60 ml-1">units</span>
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-light-neutral">
          <button
            type="button"
            onClick={() => { setMode('set'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'set' ? 'text-primary-dark-teal border-b-2 border-primary-dark-teal -mb-px bg-white' : 'text-primary-dark/50 hover:text-primary-dark bg-soft-ivory/30'}`}
          >
            Set Exact Stock
          </button>
          <button
            type="button"
            onClick={() => { setMode('adjust'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'adjust' ? 'text-primary-dark-teal border-b-2 border-primary-dark-teal -mb-px bg-white' : 'text-primary-dark/50 hover:text-primary-dark bg-soft-ivory/30'}`}
          >
            Adjust (+/-)
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {mode === 'set' ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary-dark" htmlFor="exact-qty">
                  New Stock Quantity
                </label>
                <input
                  id="exact-qty"
                  type="number"
                  min="0"
                  max="100000"
                  required
                  value={exactValue}
                  onChange={(e) => setExactValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-lg font-bold"
                />
                <p className="text-xs text-primary-dark/50">Range: 0 – 100,000 units</p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary-dark" htmlFor="adjust-qty">
                  Adjustment Amount
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAdjustValue(v => String((parseInt(v) || 0) - 1))}
                    className="w-10 h-10 rounded-lg border border-light-neutral bg-soft-ivory flex items-center justify-center text-primary-dark hover:bg-light-neutral/50 transition-colors flex-shrink-0"
                    aria-label="Decrease"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    id="adjust-qty"
                    type="number"
                    required
                    value={adjustValue}
                    onChange={(e) => setAdjustValue(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-lg font-bold text-center"
                    placeholder="e.g. +5 or -3"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustValue(v => String((parseInt(v) || 0) + 1))}
                    className="w-10 h-10 rounded-lg border border-light-neutral bg-soft-ivory flex items-center justify-center text-primary-dark hover:bg-light-neutral/50 transition-colors flex-shrink-0"
                    aria-label="Increase"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Preview */}
            {!isNaN(previewQty) && (
              <div className="rounded-lg bg-soft-ivory/60 border border-light-neutral p-3 flex items-center justify-between">
                <span className="text-sm text-primary-dark/60">Stock after update:</span>
                <span className={`text-lg font-bold ${previewQty < 0 ? 'text-red-600' : previewQty === 0 ? 'text-red-500' : previewQty <= 5 ? 'text-amber-600' : 'text-primary-dark-teal'}`}>
                  {previewQty < 0 ? '—' : `${previewQty} units`}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 px-6 pb-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isBusy} className="bg-white">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isBusy} className="flex items-center gap-2 min-w-[120px] justify-center">
              {isBusy ? <><Loader2 size={16} className="animate-spin" /> Updating…</> : 'Update Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
