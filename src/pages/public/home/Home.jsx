import React from 'react'   
import { ArrowRight, ShieldCheck, Users, BarChart3, Calendar } from 'lucide-react';
import Testimonial from './testimonial';
import Footer from '../../../components/common/Footer';
import Header from '../../../components/common/Header';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
     
   <Header />

      {/* 2. Hero Section - Split Layout with Visual Weight */}
      <section className="pt-40 pb-20 px-6">
        <div className=" flex flex-row justify-center items-center">
          
          {/* Left: Content */}
          <div className="space-y-8">
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
             Making Every Event <br/>
              <span className="flex justify-center  text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-600">
                Memorable.
              </span>
            </h1>
            <div className='flex justify-center max-w-2xl text-center'>

            <p className=" text-lg text-slate-600  leading-relaxed">
              Eventalk is the all-in-one platform to organize, manage & analyze your events.
                  &nbsp;
                 <span>
                     From <span className='text-[#ff6900]'>  ticket </span> sales to real-time check-ins.    
                 </span>
            </p>
            </div>
            
            <div className="flex  justify-center ">
            <Link to='/events'>  <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 hover:-translate-y-1 transition-all">
                Explore <ArrowRight className="h-4 w-4" />
              </button>
              </Link>
             
            </div>

            
            
           
          </div>

         
          
        </div>
      </section>


          <div className='flex justify-around items-center bg-black w-full h-30'>
              

             <Testimonial digit='500+' content='Events Organized' />
             <Testimonial digit='10k+' content='User Registrations' />
              <Testimonial digit='4.9/5' content='Average Rating' />
              <Testimonial digit='100+' content='Events Completed' />

             
             
          </div>

      {/* 3. Stats / Bento Grid Section (Breaking the White) */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900">Everything you need to scale.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">CRM & Guest Lists</h3>
              <p className="text-slate-500">Import contacts, segment audiences, and send invites in one click.</p>
            </div>

            {/* Card 2 (Featured - Taller or Different Color) */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
                 <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Ticketing</h3>
              <p className="text-slate-500">Fraud-proof QR codes and instant payouts directly to your bank account.</p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Analytics</h3>
              <p className="text-slate-500">Track sales, page views, and conversion rates as they happen.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </div>
  )
}

export default Home
