import React from "react";
import { jsPDF } from "jspdf";


const PDFFile = () => {
    const doc = new jsPDF();
    const pageColors = ['#f6d186', '#f67280', '#c06c84'];
    doc.text("Hello world!", 10, 10);
    doc.save("a4.pdf");

};

export default PDFFile;