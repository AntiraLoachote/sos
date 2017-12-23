import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  
  constructor() { }

  ngOnInit() {

    $(function () { // DOM ready 
      // If a link has a dropdown, add sub menu toggle. 
      $('#navbarResponsive nav ul li a:not(:only-child)').click(function (e) { 
        $(this).siblings('#navbarResponsive .nav-dropdown').toggle(); 
        // Close one dropdown when selecting another 
        $('#navbarResponsive .nav-dropdown').not($(this).siblings()).hide(); 
        e.stopPropagation(); 
      }); 
      // Clicking away from dropdown will remove the dropdown class 
      $('html').click(function () { 
        $('#navbarResponsive .nav-dropdown').hide(); 
      }); 
      // Toggle open and close nav styles on click 
      $('#nav-toggle').click(function () { 
        $('nav ul').slideToggle(); 
      }); 
 
 
      $('#nav-toggle-link-1').click(function () { 
        $('nav ul').slideToggle(); 
      }); 
 
      $('#nav-toggle-link-2').click(function () { 
        $('nav ul').slideToggle(); 
      }); 
 
      $('#nav-toggle-link-3').click(function () { 
        $('nav ul').slideToggle(); 
      }); 
 
      $('#nav-toggle-link-4').click(function () { 
        $('nav ul').slideToggle(); 
      }); 
 
      $('#nav-toggle-link-5').click(function () { 
        $('nav ul').slideToggle(); 
      }); 
 
      $('#nav-toggle-link-6').click(function () { 
        $('nav ul').slideToggle(); 
      }); 
 
      // Hamburger to X toggle 
      // $('#nav-toggle').on('click', function () { 
      //   this.classList.toggle('active'); 
      // }); 
 
      
 
    }); // end DOM ready 

  }

}
