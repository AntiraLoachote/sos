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
      $('nav ul li a:not(:only-child)').click(function (e) {
        $(this).siblings('.nav-dropdown').toggle();
        // Close one dropdown when selecting another
        $('.nav-dropdown').not($(this).siblings()).hide();
        e.stopPropagation();
      });
      // Clicking away from dropdown will remove the dropdown class
      $('html').click(function () {
        $('.nav-dropdown').hide();
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
      $('#nav-toggle').on('click', function () {
        this.classList.toggle('active');
      });

      // $('#nav-toggle-link-1').on('click', function () {
      //   this.classList.toggle('active');
      // });

      // $('#nav-toggle-link-2').on('click', function () {
      //   this.classList.toggle('active');
      // });

      // $('#nav-toggle-link-3').on('click', function () {
      //   this.classList.toggle('active');
      // });

      // $('#nav-toggle-link-4').on('click', function () {
      //   this.classList.toggle('active');
      // });

      // $('#nav-toggle-link-5').on('click', function () {
      //   this.classList.toggle('active');
      // });

      // $('#nav-toggle-link-6').on('click', function () {
      //   this.classList.toggle('active');
      // });

    }); // end DOM ready

  }




}
