import  { useState } from 'react'
import { appPlans } from '../assets/assets'
import Footer from '../components/Footer'
import { authClient } from '@/lib/auth-client'
import api from '@/configs/axios'
import { toast } from 'sonner'


interface Plan {
  id: string
  name: string
  price: string
  credits: number
  description: string
  features: string[]
}

const Pricing = () => {
  const {data: session} = authClient.useSession()
  const [plans] = useState<Plan[]>(appPlans)

  const handlePurchase = async (planId: string) => {
     console.log("Plan ID:", planId);
     try{
       if(!session?.user)
         return 
        toast('please login to purchase a credits')
        const { data } = await api.post('/api/user/purchase-credits', { planId })

         
      window.location.href = data.payment_link;
      
        
      }catch(error : any) {
       toast.error(error.response?.data?.message || error.message);
       console.log(error)
     }

  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19]">
      
      {/* Main Content */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-16">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-white text-4xl font-bold">
            Choose Your Plan
          </h2>

          <p className="text-gray-400 text-sm max-w-2xl mx-auto mt-3">
            Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">

          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="p-6 bg-black/30 border border-indigo-900 rounded-2xl text-white shadow-lg hover:border-indigo-500 transition duration-300"
            >
              <h3 className="text-2xl font-semibold">
                {plan.name}
              </h3>

              <div className="my-4">
                <span className="text-4xl font-bold">
                  {plan.price}
                </span>

                <span className="text-gray-400 text-sm">
                  {" "} / {plan.credits} credits
                </span>
              </div>

              <p className="text-gray-400 mb-6">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-300">
                    
                    <svg
                      className="h-5 w-5 text-indigo-400 mr-2 mt-0.5 shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>

                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan.id)}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 active:scale-95 rounded-lg text-sm font-medium transition"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-white/60 max-w-xl mx-auto mt-12">
          Project <span className="text-white">Creation / Revision</span> consumes{" "}
          <span className="text-white">5 credits</span>. You can purchase more credits to create more projects.
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Pricing