export default function EmptyTableState({ 
  colSpan, 
  message = "No data found." 
}: { 
  colSpan: number, 
  message?: string 
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center text-[#6A7282]">
        {message}
      </td>
    </tr>
  );
}
