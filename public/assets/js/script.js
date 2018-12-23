$(document).ready(function(){


var header_NotificationButton = $('header .function .notification');
var header_Notification = $('header .toggle .notification');
var header_NotificationActive = false;
var header_DropdownButton = $('header .function .user');
var header_Dropdown = $('header .toggle .dropdown');
var header_DropdownActive = false;

header_NotificationButton.click(function(){
  header_Dropdown.removeClass('open')
  if(header_Notification.hasClass('open')){
    header_Notification.removeClass('open')
    header_NotificationActive = false;
  }else{
    header_Notification.addClass('open')
    header_NotificationActive = true;
  }
})

header_DropdownButton.click(function(){
  header_Notification.removeClass('open')
  if(header_Dropdown.hasClass('open')){
    header_Dropdown.removeClass('open')
    header_DropdownActive = false;
  }else{
    header_Dropdown.addClass('open')
    header_DropdownActive = true;
  }
});

$(document).on('click', function(e){
  if(header_NotificationActive){
    if(!header_NotificationButton.is(e.target) && header_NotificationButton.has(e.target).length === 0 && !header_Notification.is(e.target) && header_Notification.has(e.target).length === 0){
      header_Notification.removeClass('open');
      header_NotificationActive = false;
      }
  }
  if(header_DropdownActive){
    if(!header_DropdownButton.is(e.target) && header_DropdownButton.has(e.target).length === 0 && !header_Dropdown.is(e.target) && header_Dropdown.has(e.target).length === 0){
      header_Dropdown.removeClass('open');
      header_DropdownActive = false;
      }
  }
})

var header_MenuButton = $('header .mobile-menu .hamburger');
var header_Menu = $('header .mobile-toggle');
var header_MenuActive = false;
var header_Logo = $('header .logo');

var header_HamburgerButton = $('header .mobile-menu .hamburger');
var header_Hamburger = $('header .mobile-menu .hamburger');
var header_HamburgerActive = false;

header_MenuButton.click(function(){
  if(header_Menu.hasClass('show')){
    header_Menu.removeClass('show')
    header_Logo.removeClass('white')
    header_MenuActive = false;
  }else{
    header_Menu.addClass('show')
    header_Logo.addClass('white')
    header_MenuActive = true;
  }
  if(header_Hamburger.hasClass('is-active')){
    header_Hamburger.removeClass('is-active')
    header_HamburgerActive = false;
  }else{
    header_Hamburger.addClass('is-active')
    header_HamburgerActive = true;
  }
})

$('section.inbox .left .conversations .item').click(function(){
  $('section.inbox .chat').addClass('show')
  if($('section.inbox .chat').hasClass('show')){
    $('section.inbox .left').addClass('hide')
    $('section.breadcrumb span.head').addClass('back')
  }else {
    $('section.inbox .chat').removeClass('hide')
    $('section.breadcrumb span.head').removeClass('hide')
  }
});

$('section.breadcrumb span.head').click(function(){ 
  $('section.inbox .chat').removeClass('show')
  $('section.inbox .left').removeClass('hide')
  $('section.breadcrumb span.head').removeClass('back')
});


var inbox_DropdownButton = $('section.inbox .chat .more');
var inbox_Dropdown = $('section.inbox .chat .more-dropdown');
var inbox_DropdownActive = false;

inbox_DropdownButton.click(function(){
  if(inbox_Dropdown.hasClass('open')){
    inbox_Dropdown.removeClass('open')
    inbox_DropdownActive = false;
  }else{
    inbox_Dropdown.addClass('open')
    inbox_DropdownActive = true;
  }
})


$(document).on('click', function(e){
  if(inbox_DropdownActive){
    if(!inbox_DropdownButton.is(e.target) && inbox_DropdownButton.has(e.target).length === 0 && !inbox_Dropdown.is(e.target) && inbox_Dropdown.has(e.target).length === 0){
      inbox_Dropdown.removeClass('open');
      inbox_DropdownActive = false;
      }
  }

})

if($('section.featured-profiles .slider').length > 0){
  $('section.featured-profiles .slider').owlCarousel({
        loop: true,
        autoplay: true,
        margin: 30,
        nav: true,
        dots: false,
        navText: ['<i class="icon-left-open">', '<i class="icon-right-open">'],
        lazyLoad: true,
        autoplayTimeout: 2400,
        autoplayHoverPause: false,
        responsive:{
              0: {
                  items: 2,
                  margin: 15,
              },
              768:{
                  items: 3,
                  margin: 15,
              },
              992:{
                  items: 4,
                  margin: 15,
              },
              1200:{
                  items: 4,
              }
        }
  })
}
if($('section.profile .photos-slider .slider-content').length > 0){
  $('section.profile .photos-slider .slider-content').owlCarousel({
        loop: false,
        autoplay: true,
        margin: 30,
        nav: true,
        dots: false,
        navText: ['<i class="icon-left-open">', '<i class="icon-right-open">'],
        lazyLoad: true,
        autoplayTimeout: 2400,
        autoplayHoverPause: false,
        responsive:{
              0: {
                  items: 3,
                  margin: 15,
              },
              420: {
                items: 4,
                margin: 15,
              },
              568: {
                items: 5,
                margin: 15,
              },
              768:{
                  items: 5,
                  margin: 15,
              },
              992:{
                  items: 6,
                  margin: 15,
              },
              1200:{
                  items: 6,
              }
        }
  })
}





});

