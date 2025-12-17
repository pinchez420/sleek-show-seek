import QRCode from 'qrcode';

export interface TicketQRData {
  ticket_number: string;
  event_id: string;
  event_name: string;
  user_id: string;
  order_id: string;
  created_at: string;
}

export const generateTicketNumber = (): string => {
  const prefix = 'TP';
  const timestamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const createQRData = (ticketNumber: string, eventId: string, eventName: string, userId: string, orderId: string): TicketQRData => {
  return {
    ticket_number: ticketNumber,
    event_id: eventId,
    event_name: eventName,
    user_id: userId,
    order_id: orderId,
    created_at: new Date().toISOString(),
  };
};

export const generateQRCode = async (data: TicketQRData): Promise<string> => {
  try {
    // Create a compressed JSON string for the QR code
    const qrDataString = JSON.stringify(data);
    
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const generateQRCodeSVG = async (data: TicketQRData): Promise<string> => {
  try {
    const qrDataString = JSON.stringify(data);
    
    const qrCodeSVG = await QRCode.toString(qrDataString, {
      type: 'svg',
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    return qrCodeSVG;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw new Error('Failed to generate QR code SVG');
  }
};

export const parseTicketData = (qrData: string): TicketQRData | null => {
  try {
    const data = JSON.parse(qrData);
    
    // Validate required fields
    if (!data.ticket_number || !data.event_id || !data.user_id || !data.order_id) {
      return null;
    }
    
    return data as TicketQRData;
  } catch (error) {
    console.error('Error parsing ticket data:', error);
    return null;
  }
};

export const validateTicketQR = (qrData: string): boolean => {
  const parsedData = parseTicketData(qrData);
  return parsedData !== null;
};
