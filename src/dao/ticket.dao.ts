import { Ticket, TicketDocument } from "../models/ticket.model";

interface DBI<T> {
  addTicketBatch(ticketInfo: any): Promise<TicketDocument>;
  getTicektList(): any;
}

export default new (class TicketDao<T> implements DBI<T> {
  addTicketBatch(ticketInfo: any): Promise<TicketDocument> {
    return Ticket.insertMany(ticketInfo);
  }
  getTicektList(): any {
    return Ticket.find();
  }
})();
