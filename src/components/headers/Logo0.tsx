import Link from 'next/link';
import React from 'react'
import Logo from '../logo/Logo';

const Logo0 = () => {
    return (
        <Link href={"/u"} className=' font-semibold flex items-center px-2 gap-2 text-lg bg-black rounded-md tracking-widest'>
            <Logo className=' h-5 w-5'/>
            <div>
                <span className=' text-[#63d3fa]'>Pro</span>
                <span className=' text-white'>track</span>
            </div>
        </Link>
    );
}

export default Logo0