// // import { useNavigate } from "react-router-dom"

// // export default function AccessAccount() {
    
// //     const navigate=useNavigate();
// //     const handleVolunteer=()=>{
// //         navigate("/auth/login")
// //     }
// //   return (
// //     <div className='w-[100vw] h-[100vh] flex gap-[30px] items-center justify-center'>
// //         <div className='place-content-center w-[45vw] p-[50px] border-amber-50 border-2 h-[90vh]'>
// //             <h1 className='text-5xl font-[500]'>For Donors</h1>
// //             <p className='mt-[20px]'>Reduce food waste and support communities in need by donating your surplus food. Your small act can make a big difference </p>
// //             <button className='btn'>Login</button>
// //             <p>Don't have an account?</p>
// //             <span>Sign up</span>
// //         </div>
// //         <div className='place-content-center w-[45vw] p-[50px]  border-amber-50 border-2 h-[90vh]'>
// //             <h1 className='text-5xl font-[500]'>For Volunteers</h1>
// //             <p className='mt-[20px]'>Join the Food Bridge mission. Help us deliver donated food to the right places. Flexible volunteering with real impact</p>
// //             <button onClick={handleVolunteer} className='btn'>Login</button>
// //             <p>Don't have an account?</p>
// //             <span>Sign up</span>
        
// //         </div>
// //     </div>
// //   )
// // }


// import { useNavigate, Link } from "react-router-dom";

// export default function AccessAccount() {
//   const navigate = useNavigate();

//   const handleDonor = () => {
//     navigate("/donor/login");
//   };

//   const handleVolunteer = () => {
//     navigate("/auth/login");
//   };

//   return (
//     <div className='w-[100vw] h-[100vh] flex gap-[30px] items-center justify-center'>
//       <div className='place-content-center w-[45vw] p-[50px] border-amber-50 border-2 h-[90vh]'>
//         <h1 className='text-5xl font-[500]'>For Donors</h1>
//         <p className='mt-[20px]'>
//           Reduce food waste and support communities in need by donating your surplus food. Your small act can make a big difference.
//         </p>
//         <button onClick={handleDonor} className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>Login</button>
//         <p className="mt-2">Don't have an account?</p>
//         <Link to="/donor/signup" className="text-blue-500 underline">Sign up</Link>
//       </div>

//       <div className='place-content-center w-[45vw] p-[50px] border-amber-50 border-2 h-[90vh]'>
//         <h1 className='text-5xl font-[500]'>For Volunteers</h1>
//         <p className='mt-[20px]'>
//           Join the Food Bridge mission. Help us deliver donated food to the right places. Flexible volunteering with real impact.
//         </p>
//         <button onClick={handleVolunteer} className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4'>Login</button>
//         <p className="mt-2">Don't have an account?</p>
//         <Link to="/auth/signup" className="text-green-500 underline">Sign up</Link>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-green-600 text-white">
        <h1 className="text-2xl font-bold">Khana Community 🍽</h1>
        <nav className="flex gap-6">
          <button onClick={() => navigate("/auth/login")} className="hover:underline">
            Login
          </button>
          <button onClick={() => navigate("/auth/signup")} className="hover:underline">
            Sign Up
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow text-center p-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Share Your Meal, Share Your Love ❤️
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Join us in fighting hunger by donating surplus food to those in need.
          Together, we’ve served more than 100+ people and counting!
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/auth/signup")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/auth/login")}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition"
          >
            Login
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-center p-4 text-sm">
        © {new Date().getFullYear()} Khana Community — Serving with Love
      </footer>
    </div>
  );
}
