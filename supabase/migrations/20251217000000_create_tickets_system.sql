-- Create tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    qr_code_data TEXT NOT NULL,
    event_id VARCHAR(100) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE,
    used_by VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_order_id ON tickets(order_id);
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_status ON tickets(status);

-- Add RLS policies
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Users can only view their own tickets
CREATE POLICY "Users can view their own tickets"
ON tickets FOR SELECT
USING (auth.uid() = user_id);

-- Users can view tickets for their orders
CREATE POLICY "Users can view tickets for their orders"
ON tickets FOR SELECT
USING (
    order_id IN (
        SELECT id FROM orders WHERE user_id = auth.uid()
    )
);

-- Add tickets to order_items view if it exists, or create a new view
CREATE OR REPLACE VIEW order_tickets AS
SELECT 
    t.id,
    t.ticket_number,
    t.qr_code_data,
    t.event_id,
    t.event_name,
    t.user_id,
    t.order_id,
    t.status,
    t.created_at,
    t.used_at,
    t.used_by,
    o.user_id as order_user_id,
    o.status as order_status,
    o.created_at as order_created_at
FROM tickets t
JOIN orders o ON t.order_id = o.id;

-- Update the function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    prefix TEXT := 'TP';
    timestamp_part TEXT := to_char(NOW(), 'YYMMDD');
    random_part TEXT := upper(substring(md5(random()::text), 1, 6));
BEGIN
    RETURN prefix || timestamp_part || random_part;
END;
$$ LANGUAGE plpgsql;

-- Add function to create tickets for an order
CREATE OR REPLACE FUNCTION create_tickets_for_order(
    p_order_id UUID,
    p_event_id VARCHAR(100),
    p_event_name VARCHAR(255),
    p_user_id UUID,
    p_quantity INTEGER
)
RETURNS TABLE(ticket_id UUID, ticket_number TEXT) AS $$
DECLARE
    ticket_record RECORD;
    new_ticket_id UUID;
    new_ticket_number TEXT;
    qr_data TEXT;
BEGIN
    FOR i IN 1..p_quantity LOOP
        new_ticket_number := generate_ticket_number();
        
        -- Create QR code data
        qr_data := json_build_object(
            'ticket_number', new_ticket_number,
            'event_id', p_event_id,
            'event_name', p_event_name,
            'user_id', p_user_id,
            'order_id', p_order_id,
            'created_at', NOW()
        )::text;
        
        -- Insert ticket
        INSERT INTO tickets (
            ticket_number,
            qr_code_data,
            event_id,
            event_name,
            user_id,
            order_id,
            status
        ) VALUES (
            new_ticket_number,
            qr_data,
            p_event_id,
            p_event_name,
            p_user_id,
            p_order_id,
            'active'
        ) RETURNING id INTO new_ticket_id;
        
        RETURN QUERY SELECT new_ticket_id, new_ticket_number;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
