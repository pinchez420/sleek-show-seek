import { supabase } from '@/integrations/supabase/client';
import { 
  generateTicketNumber, 
  createQRData, 
  generateQRCode, 
  generateQRCodeSVG,
  TicketQRData 
} from '@/lib/qrcode';
import { Database } from '@/integrations/supabase/types';

type Ticket = Database['public']['Tables']['tickets']['Row'];

export interface CreateTicketData {
  orderId: string;
  eventId: string;
  eventName: string;
  userId: string;
  quantity: number;
}

export interface TicketWithEvent extends Ticket {
  events?: {
    title: string;
    date: string;
    venue: string;
    image: string;
    price: string;
    category: string;
  };
}

export class TicketService {
  static async createTickets(data: CreateTicketData): Promise<TicketWithEvent[]> {
    const { orderId, eventId, eventName, userId, quantity } = data;
    const tickets: TicketWithEvent[] = [];

    try {
      // Create tickets one by one to get individual ticket numbers
      for (let i = 0; i < quantity; i++) {
        const ticketNumber = generateTicketNumber();
        const qrData = createQRData(ticketNumber, eventId, eventName, userId, orderId);
        
        // Generate QR code data URL
        const qrCodeDataURL = await generateQRCode(qrData);
        
        // Create ticket in database
        const { data: ticket, error } = await supabase
          .from('tickets')
          .insert({
            ticket_number: ticketNumber,
            qr_code_data: JSON.stringify(qrData),
            event_id: eventId,
            event_name: eventName,
            user_id: userId,
            order_id: orderId,
            status: 'active'
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to create ticket: ${error.message}`);
        }

        // Get event details for the ticket
        const { data: event } = await supabase
          .from('events')
          .select('title, date, venue, image, price, category')
          .eq('id', eventId)
          .single();

        tickets.push({
          ...ticket,
          events: event || undefined
        });
      }

      return tickets;
    } catch (error) {
      console.error('Error creating tickets:', error);
      throw error;
    }
  }

  static async getUserTickets(userId: string): Promise<TicketWithEvent[]> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          events (
            title,
            date,
            venue,
            image,
            price,
            category
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch tickets: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      throw error;
    }
  }

  static async getOrderTickets(orderId: string): Promise<TicketWithEvent[]> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          events (
            title,
            date,
            venue,
            image,
            price,
            category
          )
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch order tickets: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching order tickets:', error);
      throw error;
    }
  }

  static async getTicketByNumber(ticketNumber: string): Promise<TicketWithEvent | null> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          events (
            title,
            date,
            venue,
            image,
            price,
            category
          )
        `)
        .eq('ticket_number', ticketNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw new Error(`Failed to fetch ticket: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching ticket by number:', error);
      throw error;
    }
  }

  static async validateTicket(ticketNumber: string): Promise<{ valid: boolean; ticket?: TicketWithEvent; reason?: string }> {
    try {
      const ticket = await this.getTicketByNumber(ticketNumber);
      
      if (!ticket) {
        return { valid: false, reason: 'Ticket not found' };
      }

      if (ticket.status !== 'active') {
        return { valid: false, ticket, reason: `Ticket is ${ticket.status}` };
      }

      if (ticket.used_at) {
        return { valid: false, ticket, reason: 'Ticket already used' };
      }

      // Check if event has already passed
      if (ticket.events?.date) {
        const eventDate = new Date(ticket.events.date);
        const now = new Date();
        if (eventDate < now) {
          return { valid: false, ticket, reason: 'Event has already passed' };
        }
      }

      return { valid: true, ticket };
    } catch (error) {
      console.error('Error validating ticket:', error);
      return { valid: false, reason: 'Validation error' };
    }
  }

  static async useTicket(ticketNumber: string, usedBy: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          status: 'used',
          used_at: new Date().toISOString(),
          used_by: usedBy
        })
        .eq('ticket_number', ticketNumber);

      if (error) {
        throw new Error(`Failed to mark ticket as used: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error marking ticket as used:', error);
      throw error;
    }
  }

  static async getQRCodeSVG(ticket: TicketWithEvent): Promise<string> {
    try {
      const qrData = JSON.parse(ticket.qr_code_data) as TicketQRData;
      return await generateQRCodeSVG(qrData);
    } catch (error) {
      console.error('Error generating QR code SVG for ticket:', error);
      throw error;
    }
  }

  static async getQRCodeDataURL(ticket: TicketWithEvent): Promise<string> {
    try {
      const qrData = JSON.parse(ticket.qr_code_data) as TicketQRData;
      return await generateQRCode(qrData);
    } catch (error) {
      console.error('Error generating QR code data URL for ticket:', error);
      throw error;
    }
  }
}
