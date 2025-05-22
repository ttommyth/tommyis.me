import Link from 'next/link';

export default function ToolsPage() {
  return (
    <div className="pt-20 min-h-screen flex flex-col gap-8">
      <h1>Tools</h1>
      <ul className="flex flex-col gap-4">
        <li>
          <Link href="/lastepoch/leveling">Last Epoch Check List</Link>
        </li>
        <li>
          <Link href="/color-sandbox">Color Sandbox</Link>
        </li>
        <li>
          <Link href="/rtl-sandbox">RTL Sandbox</Link>
        </li>
      </ul>
    </div>
  );
}
