import React, { useState } from 'react';

export default function NavBar(){
    
    return(
    <nav className="bg-white shadow-md font-sans">
        <a href="/tutorial"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-all duration-200"
        >
            Tutorial
        </a>
    </nav>
    );
}