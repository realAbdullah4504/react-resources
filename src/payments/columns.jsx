import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span>{row.original.amount}</span>,
  },
  {
    accessorKey: "method",
    header: "Payment Method",
    cell: ({ row }) => (
      <div>
        <div>{row.original.method}</div>
        <div className="text-xs text-muted-foreground">{row.original.card}</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "Successful" ? "default" : "destructive"
        }
      >
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#34A65A] inline-block"></span>
          {row.original.status}
        </span>
      </Badge>
    ),
  },
  {
    accessorKey: "sentTo",
    header: "Sent To",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.avatar}
          alt="avatar"
          className="w-6 h-6 rounded-full"
        />
        <span>{row.original.sentTo}</span>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: () => (
      <span className="flex items-center gap-1">
        Date <span>⇅</span>
      </span>
    ),
    cell: ({ row }) => <span>{row.original.date}</span>,
  },
];
