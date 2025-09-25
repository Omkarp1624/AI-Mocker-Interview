import Image from "next/image";

export default function Home() {
  return (
    <div> 
      <h2>Heloo mera nam he omkar</h2>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" style={{ backgroundColor: '#2563eb', color: '#fff' }}>
        Click Me
      </button>
      <div className="bg-red-500 text-white p-4">Test Tailwind</div>
    </div>
  );
}
