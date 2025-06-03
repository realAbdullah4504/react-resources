import { columns } from "./columns"
import { DataTable } from "./data-table"
import { payments } from "../constants/data"
 
 
export default function DemoPage() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={payments} />
    </div>
  )
}