import { Component, ElementRef, ViewChild,OnInit } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
declare var require: any;
const htmlToPdfmake = require("html-to-pdfmake");
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import domtoimage from 'dom-to-image';
import  jsPDF from 'jspdf';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'convertHtmlToPdf';

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  getBase64ImageFromURL(url:string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

   async downloadAsPDF() {
    const pdfTable = this.pdfTable.nativeElement;
    var image = './../assets/images/zomo_vape.png'

    var html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = {
      content: [
        html,
       {
        image: await this.getBase64ImageFromURL("./../assets/images/zomo_vape.png"),
        width: 250,
        height: 150
       }

      ]

    };
    pdfMake.createPdf(documentDefinition).download();

  }

  public downloadAsPDFImage() {
      //   const pdfTable = this.pdfTable.nativeElement;
  //   var html = htmlToPdfmake(pdfTable.innerHTML);
  //   const documentDefinition = { content: html };
    let div = this.pdfTable.nativeElement;

    var img:any;
    var filename;
    var newImage:any;


    domtoimage.toPng(div, { bgcolor: '#fff' })

      .then(function(dataUrl) {

        img = new Image();
        img.src = dataUrl;
        newImage = img.src;

        img.onload = function(){

        var pdfWidth = img.width;
        var pdfHeight = img.height;

          // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image

          var doc;

          if(pdfWidth > pdfHeight)
          {
            doc = new jsPDF('l', 'px', [pdfWidth , pdfHeight]);
          }
          else
          {
            doc = new jsPDF('p', 'px', [pdfWidth , pdfHeight]);
          }


          var width = doc.internal.pageSize.getWidth();
          var height = doc.internal.pageSize.getHeight();


          doc.addImage(newImage, 'PNG',  10, 10, width, height);
          filename = 'mypdf_' + '.pdf';
          doc.save(filename);

        };


      })
      .catch(function(error) {

       // Error Handling

      });

  }

}
