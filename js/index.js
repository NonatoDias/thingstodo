/**
 * Js principal
 * @author Nonato Dias
 * @version 0.1
 * 
 * @description js principal com o modelo, todas as views e um controller
 */

 (function(webapp){
    var model = {
        cards: webapp.create([]),
        init: function(){
            var main = webapp.loadModel("main");
            var that = this;
            if(main){
                for(key in main){
                    this[key].data(main[key]);
                }
            }
        }
    }

/* ========== views =========*/
    var viewCards = {
        init: function(){
            this.el = webapp.q(".div-cards-group");
            this.render();
        },

        render: function(){
            console.log(this.el);
        }
    }


/*======== controller ======== */

    var controller = {
        init: function(){
            model.init();
            viewCards.init();
            console.log(model.cards.data());
        }
    }

    controller.init();




 })((function(window, document){

    /**
     * Cria um modelo com databind
     * @param data 
     */
    function modelFactory(data){
		this._fbs_ = [];
		this._d_ = data;
	}

	modelFactory.prototype = {
		data: function(data){
			if(data !== undefined){
				this._d_ = data;
				this._fbs_.forEach(function(f){
					try{
						f.render();
		
					}catch(err){
						console.error('A view nao possui funcao render ---> ', err);
					}            
				});
			} 			
			return this._d_;  
		},

		bind: function(view){
			this._fbs_.push(view);
		}
	}

/* ================================= */

    /**
     * Biblioteca basica 
     */
    return {
        /**
         * Busca elemento no dom
         * @return elemento
         */
        q: function(el){
            return document.querySelector(el);
        },
        /**
         * Busca elemento no dom, 
         * @return array com todos os elementos
         */
        qAll: function(el){
            var all = [];
            for(var i = 0, els = document.querySelectorAll(el); i< els.length; i++ ){
                all.push(els[i]);
            }
            return all;
        },

        /**
         * Cria um objeto com databind
         */
        create: function(data){
			return new modelFactory(data);
        },

        loadModel: function(key){
            return JSON.parse(localStorage.getItem(key));
        },

        storeModel: function(key, model){
            localStorage.setItem(key, JSON.stringify(model));
        },

        removeModel: function(key){
            localStorage.removeItem(key);
        }
    }

})(window, document));