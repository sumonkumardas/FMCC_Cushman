// ======= Placeholder Plugin =========================================
function isTouchDevice() {return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);}if (isTouchDevice() === true) {$('html').addClass('touch');} else {$('html').addClass('no-touch');}

/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(f,h,$){var a='placeholder' in h.createElement('input'),d='placeholder' in h.createElement('textarea'),i=$.fn,c=$.valHooks,k,j;if(a&&d){j=i.placeholder=function(){return this};j.input=j.textarea=true}else{j=i.placeholder=function(){var l=this;l.filter((a?'textarea':':input')+'[placeholder]').not('.placeholder').bind({'focus.placeholder':b,'blur.placeholder':e}).data('placeholder-enabled',true).trigger('blur.placeholder');return l};j.input=a;j.textarea=d;k={get:function(m){var l=$(m);return l.data('placeholder-enabled')&&l.hasClass('placeholder')?'':m.value},set:function(m,n){var l=$(m);if(!l.data('placeholder-enabled')){return m.value=n}if(n==''){m.value=n;if(m!=h.activeElement){e.call(m)}}else{if(l.hasClass('placeholder')){b.call(m,true,n)||(m.value=n)}else{m.value=n}}return l}};a||(c.input=k);d||(c.textarea=k);$(function(){$(h).delegate('form','submit.placeholder',function(){var l=$('.placeholder',this).each(b);setTimeout(function(){l.each(e)},10)})});$(f).bind('beforeunload.placeholder',function(){$('.placeholder').each(function(){this.value=''})})}function g(m){var l={},n=/^jQuery\d+$/;$.each(m.attributes,function(p,o){if(o.specified&&!n.test(o.name)){l[o.name]=o.value}});return l}function b(m,n){var l=this,o=$(l);if(l.value==o.attr('placeholder')&&o.hasClass('placeholder')){if(o.data('placeholder-password')){o=o.hide().next().show().attr('id',o.removeAttr('id').data('placeholder-id'));if(m===true){return o[0].value=n}o.focus()}else{l.value='';o.removeClass('placeholder');l==h.activeElement&&l.select()}}}function e(){var q,l=this,p=$(l),m=p,o=this.id;if(l.value==''){if(l.type=='password'){if(!p.data('placeholder-textinput')){try{q=p.clone().attr({type:'text'})}catch(n){q=$('<input>').attr($.extend(g(this),{type:'text'}))}q.removeAttr('name').data({'placeholder-password':true,'placeholder-id':o}).bind('focus.placeholder',b);p.data({'placeholder-textinput':q,'placeholder-id':o}).before(q)}p=p.removeAttr('id').hide().prev().attr('id',o).show()}p.addClass('placeholder');p[0].value=p.attr('placeholder')}else{p.removeClass('placeholder')}}}(this,document,jQuery)); 


// ======= Custom Script =========================================
jQuery(document).ready(function($){		
	
	// Placeholder 
    $('input, textarea').placeholder();
	
	// Responsive Menu
	$('#profile').clone().prependTo('#menu ul:first').wrap('<li />');
	$('#menu').prepend('<div class="menu-mob">Menu <span /></div>');
	$('#menu ul:first').addClass('menu-list');
	$('#menu .menu-mob').bind('click', function(){
		$('#menu .menu-list').slideToggle('fast');	
	});
	
	//sidebar responsive menu
	$('body').append('<div id="butmob"></div>');
	$('#butmob').bind('click', function () {
		$(this).toggleClass('active');	
		$('#sidebar').toggleClass('active');
	    
	});
	
    // toggle analytics left nav
	$('body').append('<div id="butanal"></div>');
	$('#butanal').bind('click', function () {
	    $(this).toggleClass('active');
	    $('#sidebar').toggleClass('active');
	});

	/* Scroller */
	$('#content').jScrollPane({
		autoReinitialise: true,
		showArrows: false,
		arrowScrollOnHover: true,
		contentWidth: '0px',
		arrowButtonSpeed: 100
	}).data('jsp');
	
	$('.scroller').jScrollPane({
		autoReinitialise: true,
		showArrows: false,
		arrowScrollOnHover: true,
		contentWidth: '0px',
		arrowButtonSpeed: 100
	}).data('jsp');

    function CreateScrollBar(id) {

        $(id).jScrollPane({
            autoReinitialise: true,
            showArrows: false,
            arrowScrollOnHover: true,
            contentWidth: '0px',
            arrowButtonSpeed: 100
        }).data('jsp');
    }
});
