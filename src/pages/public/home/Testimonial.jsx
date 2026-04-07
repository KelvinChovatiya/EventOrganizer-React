import React from 'react'

const testimonial = (props) => {
    console.log(props.digit);
    
  return (
    <div>
      <h2 className=' text-white text-xl font-bold text-center'>{props.digit}                 
                <p className='w-full'>{props.content}</p>
              </h2>
    </div>
  )
}

export default testimonial
