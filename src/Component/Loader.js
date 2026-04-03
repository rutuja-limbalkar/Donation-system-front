import React from 'react'
import { useHistory } from 'react-router-dom';
import Header from '../Component/Header';
import Footer from '../Component/footer';

function Loader(props){
    const title= props.title
    const pageTitle= props.pageTitle
    return (
        <>
        <Header />
        <div id="wrapper">
        <div id="page-wrapper">
        <div className="row">
        <div className="container-fluid">
        <div className="white-box">
        <div className="text-center">
        <div className="spinner-grow text-success centered" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        <Footer />
        </>
    )
}

export default Loader;