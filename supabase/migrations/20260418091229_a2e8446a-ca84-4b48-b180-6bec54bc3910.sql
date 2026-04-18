CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_time_slot ON public.orders(time_slot);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can place an order
CREATE POLICY "Anyone can create an order"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Security definer function to get slot counts without exposing customer data
CREATE OR REPLACE FUNCTION public.get_slot_counts()
RETURNS TABLE(time_slot TEXT, order_count BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT time_slot, COUNT(*)::BIGINT AS order_count
  FROM public.orders
  WHERE created_at::date = CURRENT_DATE
  GROUP BY time_slot;
$$;

-- Security definer function to atomically place an order if slot has capacity
CREATE OR REPLACE FUNCTION public.place_order(
  _name TEXT,
  _address TEXT,
  _phone TEXT,
  _time_slot TEXT,
  _items JSONB,
  _total_price NUMERIC
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count INT;
  _new_id UUID;
BEGIN
  SELECT COUNT(*) INTO _count
  FROM public.orders
  WHERE time_slot = _time_slot
    AND created_at::date = CURRENT_DATE;

  IF _count >= 2 THEN
    RAISE EXCEPTION 'TIME_SLOT_FULL' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.orders (customer_name, customer_address, customer_phone, time_slot, items, total_price)
  VALUES (_name, _address, _phone, _time_slot, _items, _total_price)
  RETURNING id INTO _new_id;

  RETURN _new_id;
END;
$$;