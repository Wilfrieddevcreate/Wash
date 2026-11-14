'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { demoOrders, items, LOGISTICS_FEE, type Order } from './data';

export type Collect = { address: string; zone: string; date: string; slot: string; notes: string };
export const emptyCollect: Collect = { address: '', zone: 'Zogbadjè', date: '', slot: '08:00 — 10:00', notes: '' };

type Store = {
  cart: Record<number, number>;
  cartCount: number;
  subtotal: number;
  total: number;
  setQty: (id: number, delta: number) => void;
  add: (id: number) => void;
  serviceId: string;
  setServiceId: (id: string) => void;
  collect: Collect;
  setCollect: (c: Collect) => void;
  placedOrders: Order[];
  placeOrder: () => Order;
  resetOrder: () => void;
  notice: string;
  notify: (message: string) => void;
};

const Ctx = createContext<Store | null>(null);

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore doit être utilisé dans <StoreProvider>');
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [serviceId, setServiceId] = useState('');
  const [collect, setCollect] = useState<Collect>(emptyCollect);
  const [placedOrders, setPlacedOrders] = useState<Order[]>([]);
  const [notice, setNotice] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const counter = useRef(24102);

  useEffect(() => () => clearTimeout(timer.current), []);

  const notify = useCallback((message: string) => {
    clearTimeout(timer.current);
    setNotice(message);
    timer.current = setTimeout(() => setNotice(''), 2200);
  }, []);

  const setQty = useCallback((id: number, delta: number) => {
    setCart((c) => {
      const next = Math.max(0, (c[id] ?? 0) + delta);
      const { [id]: _removed, ...rest } = c;
      return next > 0 ? { ...rest, [id]: next } : rest;
    });
  }, []);

  const add = useCallback((id: number) => {
    setQty(id, 1);
    notify('Article ajouté à votre commande');
  }, [setQty, notify]);

  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const subtotal = useMemo(
    () => Object.entries(cart).reduce((sum, [id, qty]) => sum + (items.find((i) => i.id === Number(id))?.price ?? 0) * qty, 0),
    [cart],
  );
  const total = subtotal > 0 ? subtotal + LOGISTICS_FEE : 0;

  const resetOrder = useCallback(() => {
    setCart({});
    setServiceId('');
    setCollect(emptyCollect);
  }, []);

  const placeOrder = useCallback((): Order => {
    const order: Order = {
      id: `SG-${counter.current++}`,
      client: 'Vous',
      zone: collect.zone,
      total,
      status: 'Collecte programmée',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      pieces: cartCount,
      pickup: `${new Date(collect.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })} · ${collect.slot}`,
      stage: 1,
    };
    setPlacedOrders((o) => [order, ...o]);
    setCart({});
    setServiceId('');
    setCollect(emptyCollect);
    return order;
  }, [collect, total, cartCount]);

  const value: Store = { cart, cartCount, subtotal, total, setQty, add, serviceId, setServiceId, collect, setCollect, placedOrders, placeOrder, resetOrder, notice, notify };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const allOrders = (placed: Order[]) => [...placed, ...demoOrders];
