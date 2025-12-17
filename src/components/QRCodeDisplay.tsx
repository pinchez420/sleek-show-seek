import QRCode from 'react-qr-code';
import { cn } from '@/lib/utils';

// We accept 'any' for ticket to prevent TypeScript blocking the build 
// while you are setting up the types.
interface QRCodeDisplayProps {
  ticket: any; 
  size?: number;
  className?: string;
}

const QRCodeDisplay = ({ ticket, size = 180, className }: QRCodeDisplayProps) => {
  // If no ticket data, show placeholder
  if (!ticket) return null;

  // We use the QR data if it exists, otherwise fall back to the ticket ID
  const qrValue = ticket.qr_code_data || ticket.id || "INVALID_TICKET";

  return (
    <div 
      className={cn(
        "flex items-center justify-center bg-white border border-gray-200 rounded-lg p-4",
        className
      )}
      style={{ width: "fit-content", height: "auto" }}
    >
      <QRCode
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={qrValue}
        viewBox={`0 0 256 256`}
      />
    </div>
  );
};

export default QRCodeDisplay;