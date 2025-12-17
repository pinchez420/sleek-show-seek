import { Calendar, MapPin, QrCode, User, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TicketWithEvent } from "@/services/ticketService";
// CHANGE IS HERE: Remove curly braces for default import
import QRCodeDisplay from "./QRCodeDisplay"; 
import { cn } from "@/lib/utils";

interface TicketCardProps {
  ticket: TicketWithEvent;
  showQRCode?: boolean;
  compact?: boolean;
  className?: string;
}

const TicketCard = ({ ticket, showQRCode = true, compact = false, className }: TicketCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'used':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (compact) {
    return (
      <Card className={cn("glass hover:shadow-lg transition-all", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-sm truncate">{ticket.event_name}</h3>
              <p className="text-xs text-muted-foreground">{ticket.events?.venue}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", getStatusColor(ticket.status))}>
                {getStatusIcon(ticket.status)}
                <span className="ml-1">{ticket.status}</span>
              </Badge>
              <span className="text-xs font-mono">{ticket.ticket_number}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("glass hover:shadow-xl transition-all duration-300", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{ticket.event_name}</CardTitle>
          <Badge className={cn("flex items-center gap-1", getStatusColor(ticket.status))}>
            {getStatusIcon(ticket.status)}
            <span className="capitalize">{ticket.status}</span>
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-mono">#{ticket.ticket_number}</span>
          <span>Created {new Date(ticket.created_at).toLocaleDateString()}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Details */}
        {ticket.events && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatEventDate(ticket.events.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{ticket.events.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-primary" />
              <span>{ticket.events.category}</span>
            </div>
          </div>
        )}

        {/* QR Code */}
        {showQRCode && ticket.status === 'active' && (
          <div className="flex flex-col items-center space-y-2 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm font-medium">
              <QrCode className="h-4 w-4" />
              Event Entry QR Code
            </div>
            <QRCodeDisplay 
              ticket={ticket} 
              size={180} 
              className="border rounded-lg p-2 bg-white"
            />
            <p className="text-xs text-muted-foreground text-center">
              Present this QR code at the event entrance
            </p>
          </div>
        )}

        {/* Used Ticket Info */}
        {ticket.status === 'used' && ticket.used_at && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span>Used on {new Date(ticket.used_at).toLocaleString()}</span>
            {ticket.used_by && <span className="text-muted-foreground">by {ticket.used_by}</span>}
          </div>
        )}

        {/* Image */}
        {ticket.events?.image && (
          <div className="relative h-32 rounded-lg overflow-hidden">
            <img
              src={ticket.events.image}
              alt={ticket.event_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketCard;