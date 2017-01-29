jQuery.noConflict();

(
	function( $ ) {

		var woocommerce_de = {

			init: function() {
				this.setupAjax();
				this.remove_totals();
				this.register_payment_update();
				this.on_update_variation();
			},

			setupAjax: function() {
				if ( typeof wgm_wpml_ajax_language !== 'undefined' ) {
					$.ajaxSetup( { data: { 'lang': wgm_wpml_ajax_language } } );
				}
			},

			remove_totals: function() {

				if ( woocommerce_remove_updated_totals == 1 ) {
					$( '.woocommerce_message' ).remove();
				}
			},

			register_payment_update: function() {
				$( document.body ).on( 'change', 'input[name="payment_method"]', function() {
					$( 'body' ).trigger( 'update_checkout' );
				} );
			},

			on_update_variation: function() {
				var product = $( 'body.single-product' ), price = $( 'div[itemprop="offers"]' ).first();
				product.on( 'found_variation', '.variations_form', function() {
					price.slideUp();

				} );

				product.on( 'reset_data', '.variations_form', function() {
					price.slideDown();
				} );

			}
		};

		$( document ).ready( function( $ ) {
			woocommerce_de.init();
		} );

	}
)( jQuery );