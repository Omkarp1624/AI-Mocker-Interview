// import { SignIn } from '@clerk/nextjs';

// export default function Page() {
//   return (
//     <div className="relative w-screen h-screen flex justify-center items-center">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center z-[-1]"
//         style={{
//           backgroundImage: `url('https://images.unsplash.com/photo-1742426426875-4c16b5f4e95e?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
//         }}
//       ></div>

//       {/* Login Form */}
//       <div className="bg-white bg-opacity-90  rounded-lg shadow-lg dark:bg-gray-800">
//       <SignIn  />
//       </div>
//     </div>
//   );
// }

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}
