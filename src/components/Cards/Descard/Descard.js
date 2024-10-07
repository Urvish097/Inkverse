import React from 'react'

const Descard = ({ Des }) => {
    return (
        <>
            <div className='des_bg d-flex justify-content-center align-items-center' style={{ backgroundImage: "url(" + Des.DesImage + ")" }}>
                <h5 className='Europa_Bold text-white'>{Des.Name}</h5>
            </div>
        </>
    )
}

export default Descard